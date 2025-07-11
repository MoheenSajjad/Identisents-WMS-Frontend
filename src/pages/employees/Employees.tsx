import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { getColumns } from './columns';
import { useCallback, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { IEmployee } from '@/types/employee';
import { EmployeeService } from '@/services/employee-services';
import { CreateEmployeeModal } from '@/components/parts/modals/create-employee-modal';

export const Employees = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<IEmployee | null>(null);

  const { toggleOff, toggleOn, isToggled } = useToggle();
  const {
    toggleOff: closeDeleteModal,
    toggleOn: openDeleteModal,
    isToggled: isDeleteModalOpen,
  } = useToggle();

  const { submit: deleteEmployeeRecord, isSubmitting: isDeleting } = useFormSubmit(
    (params: { employeeId: string; isDeleted: boolean }, signal: AbortSignal) =>
      EmployeeService.delete(params.employeeId, params.isDeleted, signal),
    {
      onSuccess: () => {
        setDeleteEmployee(null);
        closeDeleteModal();
        refetch();
      },
      onError: () => {},
    }
  );

  function handleEmployeeSelection(employee: IEmployee | null) {
    setSelectedEmployee(employee);
    toggleOn();
  }

  async function handleEmployeeDelete() {
    if (!deleteEmployee) return;
    await deleteEmployeeRecord({
      employeeId: deleteEmployee._id,
      isDeleted: (deleteEmployee as any).isDeleted,
    });
  }

  const columns = useMemo(
    () =>
      getColumns(handleEmployeeSelection, employee => {
        setDeleteEmployee(employee);
        openDeleteModal();
      }),
    []
  );

  const fetchEmployees = useCallback((signal: AbortSignal) => EmployeeService.get(signal), []);

  const {
    data: employees,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PaginatedResponse<IEmployee[]>>>(fetchEmployees);

  const { table } = useDataTable({
    data: employees?.data.records || [],
    columns,
    pageCount: employees?.data.pagination.totalPages ?? 1,
  });

  return (
    <>
      <PageTransition>
        <Paper>
          <Paper.BigTitle title="Employees" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
              <AddNewButton onClick={toggleOn} />
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>

      {isToggled && (
        <CreateEmployeeModal
          mode={!!selectedEmployee ? 'edit' : 'create'}
          onSubmit={() => {
            setSelectedEmployee(null);
            toggleOff();
            refetch();
          }}
          onCancel={() => {
            setSelectedEmployee(null);
            toggleOff();
          }}
          employee={selectedEmployee}
        />
      )}

      {isDeleteModalOpen && deleteEmployee && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleEmployeeDelete}
          isRestore={(deleteEmployee as any).isDeleted}
          isLoading={isDeleting}
          deleteHeader="Delete Employee"
          deleteMessage="Are you sure you want to delete this employee?"
          restoreHeader="Restore Employee"
          restoreMessage="Are you sure you want to restore this employee?"
        />
      )}
    </>
  );
};
