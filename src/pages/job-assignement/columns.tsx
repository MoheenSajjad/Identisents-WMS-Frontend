import { ColumnDef } from '@tanstack/react-table';
import { DeleteIconButton, HeaderButton, ViewIconButton } from '@/components/parts/Buttons';
import { TableAlign } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { IJobAssignment, JobStatus } from '@/types/job-assignment';
import { DateTime } from '@/utils/date-time';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';
import { useNavigate } from 'react-router-dom';
import { CircleDot } from 'lucide-react';

export const getColumns = (
  onAssign: (id: string, employeeId?: string) => void,
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
    accessorKey: 'assignedTo',
    header: ({ column }) => (
      <HeaderButton
        label="Assigned To"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      />
    ),
    enableSorting: true,
    cell: ({ row }) =>
      row.original?.employeeId?.employeeCode &&
      `${row.original?.employeeId?.employeeName} (${row.original?.employeeId?.employeeCode})`,
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
    cell: ({ row }) => renderJobStatusTag(row.original.status),
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
      <Button
        variant={
          row.original.status === JobStatus.ASSIGNED
            ? Button.Variant.PRIMARY
            : Button.Variant.OUTLINE
        }
        size={Button.Size.SMALL}
        onClick={() => onAssign(row.original._id, row.original.employeeId?._id)}
        disabled={
          row.original.status != JobStatus.PENDING && row.original.status != JobStatus.ASSIGNED
        }
      >
        {row.original.status !== JobStatus.PENDING ? 'Assigned' : 'Assign'}
      </Button>
    ),
  },
  {
    id: 'actions',
    header: () => <HeaderButton label="Actions" showSortIcon={false} />,
    meta: { CellAlign: TableAlign.CENTER, HeadAlign: TableAlign.CENTER },
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <>
          <ViewIconButton onClick={() => navigate(`/job/${row.original._id}`)} />
          <DeleteIconButton onClick={() => onDelete?.(row.original)} />
        </>
      );
    },
  },
];

const renderJobStatusTag = (status: string) => {
  return (
    <Tag
      type={
        status === JobStatus.PENDING
          ? Tag.type.INACTIVE
          : status === JobStatus.ASSIGNED
            ? Tag.type.INFO
            : status === JobStatus.IN_PROCESS
              ? Tag.type.WARNING
              : status === JobStatus.COMPLETED
                ? Tag.type.ACTIVE
                : Tag.type.ERROR
      }
      icon={
        status === JobStatus.PENDING ? (
          <Icons.ClockFading />
        ) : status === JobStatus.ASSIGNED ? (
          <Icons.CirclePlay />
        ) : status === JobStatus.IN_PROCESS ? (
          <Icons.Loader />
        ) : status === JobStatus.COMPLETED ? (
          <Icons.CheckCircle />
        ) : (
          <Icons.CircleX />
        )
      }
      label={status}
    />
  );
};

