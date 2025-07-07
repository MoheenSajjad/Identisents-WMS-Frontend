import { IWarehouse } from '@/types/warehouse';
import { ColumnDef } from '@tanstack/react-table';
import { DeleteIconButton, EditIconButton, HeaderButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { Icons } from '@/components/Icons';

export function getColumns(
  onEdit?: (warehouse: IWarehouse) => void,
  onDelete?: (warehouse: IWarehouse) => void
): ColumnDef<IWarehouse>[] {
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
      accessorKey: 'name',
      header: ({ column }) => (
        <HeaderButton
          label="Name"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'isBinLocationEnabled',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: ({ column }) => (
        <HeaderButton
          label="Bin Location Enabled"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <Tag
          type={row.original.isBinLocationEnabled ? Tag.type.ACTIVE : Tag.type.INACTIVE}
          label={row.original.isBinLocationEnabled ? 'Enabled' : 'Disabled'}
          icon={row.original.isBinLocationEnabled ? <Icons.CheckCircle /> : <Icons.CircleX />}
        />
      ),
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
    {
      id: 'actions',
      header: () => <HeaderButton label="Actions" showSortIcon={false} />,
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      cell: ({ row }) => {
        return (
          <>
            <EditIconButton onClick={() => onEdit?.(row.original)} />
            <DeleteIconButton onClick={() => onDelete?.(row.original)} />
          </>
        );
      },
    },
  ];
}
