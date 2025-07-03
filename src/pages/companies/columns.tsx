import { ICompany } from '@/types/company';
import { ColumnDef } from '@tanstack/react-table';
import { DeleteIconButton, EditIconButton, HeaderButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { DateTime } from '@/utils/date-time';

export function getColumns(
  onEdit?: (company: ICompany) => void,
  onDelete?: (company: ICompany) => void
): ColumnDef<ICompany>[] {
  return [
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
      accessorKey: 'username',
      header: ({ column }) => (
        <HeaderButton
          label="Username"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'database',
      header: ({ column }) => (
        <HeaderButton
          label="Database"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'serverUrl',
      header: ({ column }) => (
        <HeaderButton
          label="SAP Server Url"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        />
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'password',
      header: () => <HeaderButton label="Password" />,
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
            <DeleteIconButton onClick={() => onDelete?.(row.original)} />
          </>
        );
      },
    },
  ];
}
