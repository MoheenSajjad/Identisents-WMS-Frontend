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
  return <thead className={`bg-[#e9ecef] ${className}`}>{children}</thead>;
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
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td className={`px-4 py-1 text-xs text-gray-900 ${className}`}>
      <div className={`flex ${justifyCellClasses[justify]} ${alignClasses[align]}`}>{children}</div>
    </td>
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
      className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase ${
        sortable ? 'cursor-pointer hover:bg-gray-100' : ''
      } ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className={`flex items-center gap-1 ${justifyCellClasses[justify]}`}>
        {children}
        {sortable && (
          <span className="text-gray-400">
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
};

// Compose Table with dot notation
export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeaderCell: TableHeaderCell,
  Justify: JustifyCell,
});
