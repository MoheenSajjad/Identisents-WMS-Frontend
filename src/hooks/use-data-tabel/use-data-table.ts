import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';

import { pageSize } from '@/config';

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'getFilteredRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  history?: 'push' | 'replace';
  scroll?: boolean;
  shallow?: boolean;
  throttleMs?: number;
  debounceMs?: number;
  startTransition?: React.TransitionStartFunction;
  clearOnDefault?: boolean;
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: {
      id: string;
      desc: boolean;
    }[];
  };
}

export function useDataTable<TData>({
  pageCount = -1,
  history = 'replace',
  scroll = false,
  shallow = true,
  throttleMs = 50,
  debounceMs = 300,
  clearOnDefault = false,
  startTransition,
  initialState,
  ...props
}: UseDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  );

  // Global filter state
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [page, setPage] = React.useState(initialState?.pagination?.pageIndex ?? 1);
  const [perPage, setPerPage] = React.useState(
    initialState?.pagination?.pageSize ?? Number(pageSize)
  );

  const [sort, setSort] = React.useState(() => {
    const initialSort = initialState?.sorting?.[0];
    return initialSort?.id ? `${initialSort.id}.${initialSort.desc ? 'desc' : 'asc'}` : '';
  });

  const [column, order] = sort ? sort.split('.') : ['', ''];

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: perPage,
  };

  function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    const newPagination =
      typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    setPage(newPagination.pageIndex + 1);
    setPerPage(newPagination.pageSize);
  }

  const sorting: SortingState = sort ? [{ id: column, desc: order === 'desc' }] : [];

  function onSortingChange(updaterOrValue: Updater<SortingState>) {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue(sorting);
      const validSorting = newSorting.filter(sort => sort.id && sort.id !== 'undefined');
      if (validSorting.length > 0) {
        setSort(`${validSorting[0].id}.${validSorting[0].desc ? 'desc' : 'asc'}`);
      } else {
        setSort('');
      }
    }
  }

  function onGlobalFilterChange(updaterOrValue: Updater<string>) {
    const newGlobalFilter =
      typeof updaterOrValue === 'function' ? updaterOrValue(globalFilter) : updaterOrValue;
    setGlobalFilter(newGlobalFilter);
    setPage(1);
  }

  const table = useReactTable({
    ...props,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    enableGlobalFilter: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: false,
    manualFiltering: false,
    globalFilterFn: 'includesString',
  });

  return { table, page };
}
