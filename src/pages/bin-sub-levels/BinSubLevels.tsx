import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { getColumns } from './columns';
import { useCallback, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ApiResponse } from '@/types/api';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import DeleteConfirmationModal from '@/components/parts/delete-confirmation/DeleteConfirmation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { IBinSubLevels } from '@/types/bin-sub-levels';
import { BinSubLevelService } from '@/services/bin-sub-level-services';
import { CreateBinSubLevel } from '@/components/parts/modals/create-bin-sub-level';

export const BinSubLevels = () => {
  const [selectedSubLevel, setSelectedSubLevel] = useState<IBinSubLevels | null>(null);
  const [deleteSubLevel, setDeleteSubLevel] = useState<IBinSubLevels | null>(null);

  const { toggleOff, toggleOn, isToggled } = useToggle();
  const {
    toggleOff: closeDeleteModal,
    toggleOn: openDeleteModal,
    isToggled: isDeleteModalOpen,
  } = useToggle();

  const { submit: deleteSubLevelRecord, isSubmitting: isDeleting } = useFormSubmit(
    (params: { subLevelId: string; isDeleted: boolean }, signal: AbortSignal) =>
      BinSubLevelService.deleteBinSubLevel(params.subLevelId, params.isDeleted, signal),
    {
      onSuccess: () => {
        setDeleteSubLevel(null);
        closeDeleteModal();
        refetch();
      },
      onError: error => {},
    }
  );

  function handleSubLevelSelection(subLevel: IBinSubLevels | null) {
    setSelectedSubLevel(subLevel);
    toggleOn();
  }

  async function handleSubLevelDelete() {
    if (!deleteSubLevel) return;
    await deleteSubLevelRecord({
      subLevelId: deleteSubLevel._id,
      isDeleted: deleteSubLevel.isDeleted,
    });
  }

  const columns = useMemo(
    () =>
      getColumns(handleSubLevelSelection, subLevel => {
        setDeleteSubLevel(subLevel);
        openDeleteModal();
      }),
    []
  );

  const fetchBinSubLevels = useCallback(
    (signal: AbortSignal) => BinSubLevelService.getBinSubLevels(signal),
    []
  );

  const {
    data: subLevels,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<IBinSubLevels[]>>(fetchBinSubLevels);

  const { table } = useDataTable({
    data: subLevels?.data ?? [],
    columns,
    pageCount: -1,
  });

  return (
    <>
      <PageTransition>
        <Paper>
          <Paper.BigTitle title="Bin Sub Levels" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
              <AddNewButton onClick={toggleOn} />
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>

      {isToggled && (
        <CreateBinSubLevel
          mode={!!selectedSubLevel ? 'edit' : 'create'}
          onSubmit={() => {
            setSelectedSubLevel(null);
            toggleOff();
            refetch();
          }}
          onCancel={() => {
            setSelectedSubLevel(null);
            toggleOff();
          }}
          binSubLevel={selectedSubLevel}
        />
      )}

      {isDeleteModalOpen && deleteSubLevel && (
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleSubLevelDelete();
          }}
          isRestore={deleteSubLevel?.isDeleted!}
          isLoading={isDeleting}
          deleteHeader="Delete Sub Level"
          deleteMessage="Are you sure you want to delete this sub level?"
          restoreHeader="Restore Sub Level"
          restoreMessage="Are you sure you want to restore this sub level?"
        />
      )}
    </>
  );
};
