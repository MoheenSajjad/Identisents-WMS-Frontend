import * as React from 'react';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { getCommonPinningStyles } from '@/utils/lib/datatabel';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
  TableSkeleton,
  TableSkeletonRow,
} from '@/components/ui/Table';
import { Empty } from '@/components/ui/Empty';
import { ColumnMetaType } from './datatable.types';

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;
  totalCount?: number;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null;

  /**
   * Indicates whether the data is loading.
   * @default false
   * @type {boolean}
   */
  isLoading: boolean;

  /**
   * The lable to render inside the Empty DataTable component.
   * @default null
   * @type string | null
   */
  emptyDataLabel?: string;
}

export function DataTable<TData>({
  table,
  isLoading,
  totalCount,
  floatingBar = null,
  children,
  className,
  emptyDataLabel,
  ...props
}: DataTableProps<TData>) {
  return (
    <div className={`w-full space-y-2.5 overflow-auto ${className}`} {...props}>
      {children}
      <div className="overflow-hidden rounded-md border-1 border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }),
                      }}
                      className={`text-${
                        (header.column.columnDef.meta as ColumnMetaType)?.HeadAlign ?? 'left'
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading ? (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <TableData
                            key={cell.id}
                            style={{
                              ...getCommonPinningStyles({
                                column: cell.column,
                              }),
                            }}
                            className={`text-${
                              (cell.column.columnDef.meta as ColumnMetaType)?.CellAlign ?? 'left'
                            }`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableData>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableData colSpan={table.getAllColumns().length} className="h-24 text-center">
                      <Empty label={emptyDataLabel} />
                    </TableData>
                  </TableRow>
                )}
              </>
            ) : (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableSkeletonRow key={index}>
                    <TableSkeleton />
                  </TableSkeletonRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <TablePagination table={table} />
      </div>
    </div>
  );
}
