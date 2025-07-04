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

export const Warehouses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const columns = useMemo(() => getColumns(), []);

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

  const { toggleOff, toggleOn, isToggled } = useToggle();

  return (
    <>
      <PageTransition>
        <Paper>
          <Paper.BigTitle title="Warehouse" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
              <AddNewButton onClick={toggleOn} />
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>
      {isToggled && (
        <CreateWarehouse
          onSubmit={() => {
            toggleOff();
            refetch();
          }}
          onCancel={toggleOff}
          mode="create"
          warehouse={null}
        />
      )}
    </>
  );
};
