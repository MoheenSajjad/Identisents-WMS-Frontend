import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/parts/Datatable';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ReloadButton } from '@/components/parts/Buttons';
import { PageTransition } from '@/components/parts/animations';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useToggle } from '@/hooks/use-toggle';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { IJobAssignment } from '@/types/job-assignment';
import { JobAssignmentService } from '@/services/job-assignment-service';
import { getColumns } from './columns';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import AssignJobModal from '@/components/parts/modals/assign-job-modal/AssignJobModal';
import { Outlet } from 'react-router-dom';

export const JobAssignment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobToDelete, setJobToDelete] = useState<IJobAssignment | null>(null);
  const [assignJobId, setAssignJobId] = useState<string | null>(null);

  const { toggleOn, toggleOff, isToggled } = useToggle();

  const {
    toggleOn: openDeleteModal,
    toggleOff: closeDeleteModal,
    isToggled: isDeleteModalOpen,
  } = useToggle();

  const { submit: deleteJob, isSubmitting: isDeleting } = useFormSubmit(
    (params: { id: string; isDelete: boolean }, signal: AbortSignal) =>
      JobAssignmentService.deleteJob(params.id, params.isDelete, signal),
    {
      onSuccess: () => {
        setJobToDelete(null);
        closeDeleteModal();
        refetch();
      },
    }
  );

  const handleDelete = async () => {
    if (!jobToDelete) return;
    await deleteJob({ id: jobToDelete._id, isDelete: jobToDelete.isDeleted });
  };

  const handleAssignClicked = (id: string) => {
    setAssignJobId(id);
    toggleOn();
  };

  const columns = useMemo(
    () =>
      getColumns(
        id => handleAssignClicked(id),
        job => {
          setJobToDelete(job);
          openDeleteModal();
        }
      ),
    []
  );

  const fetchJobAssignments = useCallback(
    (signal: AbortSignal) => JobAssignmentService.getJobs(currentPage, signal),
    [currentPage]
  );

  const {
    data: jobs,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PaginatedResponse<IJobAssignment[]>>>(fetchJobAssignments);

  const { table, page } = useDataTable({
    data: jobs?.data.records ?? [],
    columns,
    pageCount: jobs?.data.pagination.totalPages || 1,
  });

  useEffect(() => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [page]);

  return (
    <>
      <PageTransition>
        <Paper>
          <Paper.BigTitle title="Job Assignments" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          isLoading={isDeleting}
          isRestore={jobToDelete?.isDeleted!}
          deleteHeader="Delete Job Assignment"
          deleteMessage="Are you sure you want to delete this job assignment?"
          restoreHeader="Restore Job Assignment"
          restoreMessage="Are you sure you want to restore this job assignment?"
        />
      )}

      {isToggled && assignJobId && (
        <AssignJobModal
          onCancel={toggleOff}
          onSubmit={() => {
            setAssignJobId(null);
            toggleOff();
            refetch();
          }}
          jobId={assignJobId}
        />
      )}

      <Outlet />
    </>
  );
};
