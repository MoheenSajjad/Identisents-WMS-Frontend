import { ColumnDef } from '@tanstack/react-table';
import { EditIconButton, HeaderButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { IBinSubLevels } from '@/types/bin-sub-levels';
import { DateTime } from '@/utils/date-time';

export function getColumns(
  onEdit?: (warehouse: IBinSubLevels) => void
): ColumnDef<IBinSubLevels>[] {
  return [
    {
      accessorKey: 'level',
      header: ({ column }) => (
        <HeaderButton
          label="Level"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
      cell: ({ row }) => `Level ${row.original.level}`,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <HeaderButton
          label="Sub Level Name"
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
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <HeaderButton
          label="Created Date"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      cell: ({ row }) => DateTime.parse(row.original.createdAt).toString(),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: () => <HeaderButton label="Actions" showSortIcon={false} />,
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      cell: ({ row }) => {
        return (
          <>
            <EditIconButton onClick={() => onEdit?.(row.original)} />
          </>
        );
      },
    },
  ];
}
