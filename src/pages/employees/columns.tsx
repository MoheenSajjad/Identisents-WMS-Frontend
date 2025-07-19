import { ColumnDef } from '@tanstack/react-table';
import {
  DeleteIconButton,
  EditIconButton,
  HeaderButton,
  RestoreIconButton,
} from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { IEmployee } from '@/types/employee';
import { DateTime } from '@/utils/date-time';

export function getColumns(
  onEdit?: (employee: IEmployee) => void,
  onDelete?: (employee: IEmployee) => void
): ColumnDef<IEmployee>[] {
  return [
    {
      accessorKey: 'userCode',
      header: ({ column }) => (
        <HeaderButton
          label="User Code"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'employeeCode',
      header: ({ column }) => (
        <HeaderButton
          label="Code"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'employeeName',
      header: ({ column }) => (
        <HeaderButton
          label="Name"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'mobilePhone',
      header: () => <HeaderButton label="Phone" />,
    },
    {
      accessorKey: 'isPortalUser',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: () => <HeaderButton label="Portal User" />,
      cell: ({ row }) => (
        <Tag
          type={row.original.isPortalUser ? Tag.type.ACTIVE : Tag.type.INACTIVE}
          label={row.original.isPortalUser ? 'Yes' : 'No'}
        />
      ),
    },
    {
      accessorKey: 'isMobileUser',
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      header: () => <HeaderButton label="Mobile User" />,
      cell: ({ row }) => (
        <Tag
          type={row.original.isMobileUser ? Tag.type.ACTIVE : Tag.type.INACTIVE}
          label={row.original.isMobileUser ? 'Yes' : 'No'}
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
      enableSorting: true,
    },
    {
      id: 'actions',
      header: () => <HeaderButton label="Actions" showSortIcon={false} />,
      meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
      cell: ({ row }) => (
        <>
          <EditIconButton onClick={() => onEdit?.(row.original)} />
          {(row.original as any).isDeleted ? (
            <RestoreIconButton onClick={() => onDelete?.(row.original)} />
          ) : (
            <DeleteIconButton onClick={() => onDelete?.(row.original)} />
          )}
        </>
      ),
    },
  ];
}
