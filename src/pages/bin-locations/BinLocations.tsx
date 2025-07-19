import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { UpdateBinLocationModal } from '@/components/parts/modals/update-bin-location-modal';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { IBinLocation } from '@/types/bin-location';
import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
import { getColumns } from './columns';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { useNavigate } from 'react-router-dom';

export const BinLocation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBinLocation, setSelectedBinLocation] = useState<IBinLocation | null>(null);
  const [binLocationDelete, setBinLocationDelete] = useState<IBinLocation | null>(null);

  const {
    toggleOn: openDeleteModal,
    toggleOff: closeDeleteModal,
    isToggled: isDeleteModalOpen,
  } = useToggle();

  const {
    toggleOn: openUpdateModal,
    toggleOff: closeUpdateModal,
    isToggled: isUpdateModalOpen,
  } = useToggle();

  const navigate = useNavigate();

  const { submit: deleteBinLocation, isSubmitting: isDeleting } = useFormSubmit(
    (params: { id: string; isDelete: boolean }, signal: AbortSignal) =>
      BinLocationService.deleteBinLocation(params.id, params.isDelete, signal),
    {
      onSuccess: () => {
        setBinLocationDelete(null);
        closeDeleteModal();
        refetch();
      },
    }
  );

  async function handleDelete() {
    if (!binLocationDelete) return;
    await deleteBinLocation({ id: binLocationDelete._id, isDelete: binLocationDelete.isDeleted });
  }

  function handleEdit(binLocation: IBinLocation) {
    setSelectedBinLocation(binLocation);
    openUpdateModal();
  }

  function handleUpdateSuccess() {
    closeUpdateModal();
    setSelectedBinLocation(null);
    refetch();
  }

  const columns = useMemo(
    () =>
      getColumns(handleEdit, binLocation => {
        setBinLocationDelete(binLocation);
        openDeleteModal();
      }),
    []
  );

  const fetchBinLocations = useCallback(
    (signal: AbortSignal) => BinLocationService.getBinLocations(currentPage, signal),
    [currentPage]
  );

  const {
    data: locations,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PaginatedResponse<IBinLocation[]>>>(fetchBinLocations);

  const { table, page } = useDataTable({
    data: locations?.data.records ?? [],
    columns,
    pageCount: locations?.data.pagination.totalPages || 1,
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
          <Paper.BigTitle title="Bin Locations" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
              <AddNewButton onClick={() => navigate('/bin-location/create')} />
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
          isRestore={binLocationDelete?.isDeleted!}
          deleteHeader="Delete Bin Location"
          deleteMessage="Are you sure you want to delete this bin location?"
          restoreHeader="Restore Bin Location"
          restoreMessage="Are you sure you want to restore this bin location?"
        />
      )}

      {isUpdateModalOpen && selectedBinLocation && (
        <UpdateBinLocationModal
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          binLocation={selectedBinLocation}
          companyId={selectedBinLocation.warehouse.companyId ?? ''}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
};
