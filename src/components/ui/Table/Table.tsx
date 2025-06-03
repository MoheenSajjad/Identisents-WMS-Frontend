import React from 'react';
import { Button } from '../Button';
import { Icons } from '@/components/Icons';
import { Empty } from '../Empty';

// Table Components
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  justify?: JustifyCell;
  colSpan?: number;
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
  justify?: JustifyCell;
}

enum JustifyCell {
  Right = 'end',
  Center = 'center',
  Left = 'start',
}

const justifyCellClasses = {
  [JustifyCell.Right]: 'justify-end',
  [JustifyCell.Center]: 'justify-center',
  [JustifyCell.Left]: 'justify-start',
};

// Main Table Component
export const TableRoot: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`w-full overflow-hidden border border-gray-200 ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
};

// Table Header
export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return <thead className={`bg-gray-200 ${className}`}>{children}</thead>;
};

// Table Body
export const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return <tbody className={`divide-y divide-gray-200 bg-white ${className}`}>{children}</tbody>;
};

// Table Row
export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick }) => {
  return (
    <tr
      className={`${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
  align = 'left',
  justify = JustifyCell.Left,
  colSpan,
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td className={`px-4 py-2 text-sm text-gray-900 ${className}`} colSpan={colSpan}>
      <div className={`flex ${justifyCellClasses[justify]} ${alignClasses[align]}`}>{children}</div>
    </td>
  );
};

export const TableEmpty = ({ title = 'No Records Found' }: { title?: string }) => {
  return (
    <TableRow>
      <TableCell
        colSpan={12}
        className="h-24 text-center"
        align={'center'}
        justify={JustifyCell.Center}
      >
        <Empty label={title} />
      </TableCell>
    </TableRow>
  );
};

export const TableSkeleton = ({ length = 6 }: { length?: number }) => {
  return Array.from({ length }).map((_, index) => (
    <TableSkeletonRow key={index}>
      <td colSpan={12} className="px-3 py-1">
        <div className="mx-auto h-8 w-full animate-pulse rounded bg-gray-300"></div>
      </td>
    </TableSkeletonRow>
  ));
};

const TableSkeletonRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className="w-full animate-pulse rounded border-b border-gray-300 transition duration-150 ease-in-out last:border-b-0">
      {children}
    </tr>
  );
};

export const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  className = '',
  sortable = false,
  onSort,
  sortDirection = null,
  justify = JustifyCell.Left,
}) => {
  return (
    <th
      className={`px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase ${
        sortable ? 'cursor-pointer hover:bg-gray-100' : ''
      } ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className={`flex items-center gap-1 ${justifyCellClasses[justify]}`}>
        {children}
        {sortable && <Icons.ArrowUpDown />}
      </div>
    </th>
  );
};

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  isDisabled?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  isDisabled,
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show current page and 2 pages before and after when possible
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex items-center justify-center rounded-tl-none rounded-tr-none border border-gray-200 bg-white px-4 py-3 ${className}`}
    >
      <div className="flex items-center gap-1">
        <Button
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronsLeft />}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1 || isDisabled}
        />

        <Button
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isDisabled}
        />

        {visiblePages.map(page => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            size={Button.Size.ICON}
            roundness={Button.Roundness.FULL}
            variant={currentPage === page ? Button.Variant.PRIMARY : Button.Variant.SECONDARY}
            disabled={isDisabled}
          >
            {page}
          </Button>
        ))}

        <Button
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isDisabled}
        />
        <Button
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronsRight />}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isDisabled}
        />
      </div>
    </div>
  );
};

const TableWithPagination = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
  Pagination: TablePagination,
  Justify: JustifyCell,
  Empty: TableEmpty,
});

export { TableWithPagination as Table };
