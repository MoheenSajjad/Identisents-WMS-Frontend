import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { IWarehouse } from '@/types/warehouse';
import { getColumns } from './columns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { WarehouseService } from '@/services/warehouse-services';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import { CreateWarehouse } from '@/components/parts/modals/create-warehouse';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { GearLoading } from '@/components/ui/Loading/GearLoading';

export const Warehouses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWarehouse, setSelectedWarehouse] = useState<IWarehouse | null>(null);
  const [deleteWarehouseId, setDeleteWarehouseId] = useState<string | null>(null);

  const { toggleOff, toggleOn, isToggled } = useToggle();
  const {
    toggleOff: closeDeleteModal,
    toggleOn: openDeleteModal,
    isToggled: isDeleteModalOpen,
  } = useToggle();

  const { submit: deleteWarehouse, isSubmitting: isDeleting } = useFormSubmit(
    (warehouseId: string, signal: AbortSignal) =>
      WarehouseService.deleteWarehouse(warehouseId, signal),
    {
      onSuccess: () => {
        setDeleteWarehouseId(null);
        closeDeleteModal();
        refetch();
      },
      onError: error => {},
    }
  );

  function handleWarehouseSelection(warehouse: IWarehouse | null) {
    setSelectedWarehouse(warehouse);
    toggleOn();
  }

  async function handleWarehouseDelete() {
    if (!deleteWarehouseId) return;
    await deleteWarehouse(deleteWarehouseId);
  }

  const columns = useMemo(
    () =>
      getColumns(handleWarehouseSelection, warehouse => {
        setDeleteWarehouseId(warehouse._id);
        openDeleteModal();
      }),
    []
  );

  const fetchWarehouses = useCallback(
    (signal: AbortSignal) => WarehouseService.getWarehouses(currentPage, signal),
    [currentPage]
  );

  const {
    data: warehouses,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PaginatedResponse<IWarehouse[]>>>(fetchWarehouses);

  const { table, page } = useDataTable({
    data: warehouses?.data.records ?? [],
    columns,
    pageCount: warehouses?.data.pagination.totalPages || 1,
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
          <Paper.BigTitle title="Warehouse" />
          <GearLoading isLoading={false}>
            <DataTable table={table} isLoading={isLoading}>
              <DataTableToolbar table={table}>
                <ReloadButton onClick={refetch} />
                <AddNewButton onClick={toggleOn} />
              </DataTableToolbar>
            </DataTable>
          </GearLoading>
        </Paper>
      </PageTransition>
      {isToggled && (
        <CreateWarehouse
          onSubmit={() => {
            toggleOff();
            refetch();
          }}
          onCancel={() => {
            setSelectedWarehouse(null);
            toggleOff();
          }}
          mode={!!selectedWarehouse ? 'edit' : 'create'}
          warehouse={selectedWarehouse}
        />
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleWarehouseDelete();
        }}
        isLoading={isDeleting}
        isRestore={false}
        deleteHeader="Delete Warehouse"
        deleteMessage="Are you sure you want to delete this warehouse?"
      />
    </>
  );
};
