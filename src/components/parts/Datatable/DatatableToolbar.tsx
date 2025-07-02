import * as React from 'react';
import { XCircle } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import { cn } from '@/utils/helpers';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  debounceMs?: number;
}

export function DataTableToolbar<TData>({
  table,
  debounceMs = 300,
  children,
  className,

  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().globalFilter?.length > 0;

  return (
    <div
      className={cn('flex w-full items-center justify-between gap-2 overflow-auto', className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        <SearchInput
          placeholder="Search..."
          className="w-40 lg:w-64"
          onChange={(value: string) => table.setGlobalFilter(String(value))}
          value={table.getState().globalFilter || ''}
          icon={<Icons.Search />}
        />

        {isFiltered && (
          <Button
            variant={Button.Variant.DESTRUCTIVE}
            className="px-2 lg:px-3"
            onClick={() => {
              table.setGlobalFilter('');
            }}
            size={Button.Size.SMALL}
          >
            Reset
            <XCircle className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
