import { ColumnDef } from '@tanstack/react-table';
import { DeleteIconButton, HeaderButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { IJobAssignment } from '@/types/job-assignment';
import { DateTime } from '@/utils/date-time';
import { Button } from '@/components/ui/Button';

export const getColumns = (
  onDelete?: (job: IJobAssignment) => void
): ColumnDef<IJobAssignment>[] => [
  {
    accessorKey: 'docNum',
    header: ({ column }) => (
      <HeaderButton
        label="Doc Num"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'objType',
    header: ({ column }) => (
      <HeaderButton
        label="Object Type"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'docStatus',
    header: ({ column }) => (
      <HeaderButton
        label="Doc Status"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <HeaderButton
        label="Status"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    enableSorting: true,
    meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
    cell: ({ row }) => (
      <Tag
        type={row.original.status === 'Completed' ? Tag.type.ACTIVE : Tag.type.INACTIVE}
        label={row.original.status}
      />
    ),
  },
  {
    accessorKey: 'docDate',
    header: ({ column }) => (
      <HeaderButton
        label="Doc Date"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    cell: ({ row }) => DateTime.parse(row.original.docDate).toString(),
    enableSorting: true,
  },
  {
    id: 'assign',
    header: () => <HeaderButton label="Assign" showSortIcon={false} />,
    meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
    cell: ({ row }) => (
      <Button variant={Button.Variant.OUTLINE} size={Button.Size.SMALL}>
        Assign
      </Button>
    ),
  },
  {
    id: 'actions',
    header: () => <HeaderButton label="Actions" showSortIcon={false} />,
    meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
    cell: ({ row }) => <DeleteIconButton onClick={() => onDelete?.(row.original)} />,
  },
];
