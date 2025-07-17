import { ColumnDef } from '@tanstack/react-table';
import { HeaderButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';

export interface IGeneratedBinLocation {
  code: string;
  binSubLevel1: string;
  binSubLevel2: string;
  binSubLevel3: string;
  binSubLevel4: string;
  binSubLevel5?: string;
  hasError: boolean;
  message?: string;
  capacity: number;
  itemCode?: string;
  warehouse: string;
  isActive: boolean;
  itemGroup?: string;
  itemGroupCode?: string;
  itemName?: string;
  uom: string;
}

export function getGeneratedCodesColumns(): ColumnDef<IGeneratedBinLocation>[] {
  return [
    {
      accessorKey: 'hasError',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: ({ column }) => (
        <HeaderButton
          label="Status"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <Tag
          type={row.original.hasError ? Tag.type.ERROR : Tag.type.ACTIVE}
          label={row.original.hasError ? 'Error' : 'Success'}
        />
      ),
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <HeaderButton
          label="Bin Code"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <span className={row.original.hasError ? 'font-medium text-red-600' : 'font-medium'}>
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'message',
      header: ({ column }) => (
        <HeaderButton
          label="Message"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <span className={row.original.hasError ? 'text-red-600' : 'text-gray-600'}>
          {row.original.message ||
            (row.original.hasError ? 'Unknown error' : 'Generated successfully')}
        </span>
      ),
    },

    {
      accessorKey: 'itemName',
      header: ({ column }) => (
        <HeaderButton
          label="Item"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) =>
        `${row.original.itemName ? row.original.itemName : '-'} (${row.original.itemCode ? row.original.itemCode : '-'})`,
    },
    {
      accessorKey: 'itemGroup',
      header: ({ column }) => (
        <HeaderButton
          label="Item Group"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => `${row.original.itemGroup} (${row.original.itemGroupCode})`,
    },
    {
      accessorKey: 'capacity',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: ({ column }) => (
        <HeaderButton
          label="Capacity"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'uom',
      header: ({ column }) => (
        <HeaderButton
          label="UOM"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: ({ column }) => (
        <HeaderButton
          label="Active"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <Tag
          type={row.original.isActive ? Tag.type.ACTIVE : Tag.type.INACTIVE}
          label={row.original.isActive ? 'Active' : 'Inactive'}
        />
      ),
    },
  ];
}
