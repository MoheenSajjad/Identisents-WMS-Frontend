import { ColumnDef } from '@tanstack/react-table';
import { IBinLocation } from '@/types/bin-location';
import { TableAlign } from '@/components/ui/Table';
import { HeaderButton, DeleteIconButton, RestoreIconButton } from '@/components/parts/Buttons';
import { Tag } from '@/components/ui/Tag';
import { DateTime } from '@/utils/date-time';

export function getColumns(
  _onEdit?: (data: IBinLocation) => void,
  onDelete?: (data: IBinLocation) => void
): ColumnDef<IBinLocation>[] {
  return [
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <HeaderButton
          label="Code"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
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
    },
    {
      accessorKey: 'itemName',
      header: ({ column }) => (
        <HeaderButton
          label="Item Name"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'capacity',
      header: ({ column }) => (
        <HeaderButton
          label="Capacity"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <HeaderButton
          label="Created At"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      cell: ({ row }) => DateTime.parse(row.original.createdAt).toString(),
    },
    {
      accessorKey: 'isActive',
      header: 'Active',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      cell: ({ row }) => (
        <Tag
          type={row.original.isActive ? Tag.type.ACTIVE : Tag.type.INACTIVE}
          label={row.original.isActive ? 'Active' : 'Inactive'}
        />
      ),
    },

    {
      id: 'actions',
      header: () => <HeaderButton label="Actions" showSortIcon={false} />,
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      cell: ({ row }) => (
        <>
          {/* <EditIconButton onClick={() => onEdit?.(row.original)} /> */}
          {row.original.isDeleted ? (
            <RestoreIconButton onClick={() => onDelete?.(row.original)} />
          ) : (
            <DeleteIconButton onClick={() => onDelete?.(row.original)} />
          )}
        </>
      ),
    },
  ];
}
