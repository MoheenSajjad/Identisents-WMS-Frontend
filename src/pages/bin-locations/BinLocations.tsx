import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { useCallback, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { IBinLocation } from '@/types/bin-location';
import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
import { getColumns } from './columns';
import { ApiResponse } from '@/types/api';
// import { CreateBinLocation } from '@/components/parts/modals/create-bin-location';
import { useNavigate } from 'react-router-dom';

export const BinLocation = () => {
  const [selectedBinLocation, setSelectedBinLocation] = useState<IBinLocation | null>(null);
  const [binLocationDelete, setBinLocationDelete] = useState<IBinLocation | null>(null);

  const { toggleOn, toggleOff, isToggled } = useToggle();
  const {
    toggleOn: openDeleteModal,
    toggleOff: closeDeleteModal,
    isToggled: isDeleteModalOpen,
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

  function handleSelection(location: IBinLocation | null) {
    setSelectedBinLocation(location);
    toggleOn();
  }

  async function handleDelete() {
    if (!binLocationDelete) return;
    await deleteBinLocation({ id: binLocationDelete._id, isDelete: binLocationDelete.isDeleted });
  }

  const columns = useMemo(
    () =>
      getColumns(handleSelection, binLocation => {
        setBinLocationDelete(binLocation);
        openDeleteModal();
      }),
    []
  );

  const fetchBinLocations = useCallback(
    (signal: AbortSignal) => BinLocationService.getBinLocations(signal),
    []
  );

  const {
    data: locations,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<IBinLocation[]>>(fetchBinLocations);

  const { table } = useDataTable({
    data: locations?.data ?? [],
    columns,
    pageCount: -1,
  });

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
    </>
  );
};
