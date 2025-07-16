import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { getColumns } from './columns';
import { useCallback, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ApiResponse } from '@/types/api';
import { ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { useToggle } from '@/hooks/use-toggle';
import { IBinSubLevels } from '@/types/bin-sub-levels';
import { BinSubLevelService } from '@/services/bin-sub-level-services';
import { CreateBinSubLevel } from '@/components/parts/modals/create-bin-sub-level';

export const BinSubLevels = () => {
  const [selectedSubLevel, setSelectedSubLevel] = useState<IBinSubLevels | null>(null);

  const { toggleOff, toggleOn, isToggled } = useToggle();

  function handleSubLevelSelection(subLevel: IBinSubLevels | null) {
    setSelectedSubLevel(subLevel);
    toggleOn();
  }

  const columns = useMemo(() => getColumns(handleSubLevelSelection), []);

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
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>

      {isToggled && (
        <CreateBinSubLevel
          mode={'edit'}
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
    </>
  );
};
