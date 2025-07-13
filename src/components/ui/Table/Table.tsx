import * as React from 'react';
import { Button } from '../Button';
import { Icons } from '@/components/Icons';
import { type Table as TanstackTable } from '@tanstack/react-table';

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

// Drag and Drop Types
interface DragDropConfig<T = any> {
  enabled: boolean;
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T, index: number) => string;
}

// Grip Icon Component
const GripIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-400' }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

// Drag Handle Component
interface DragHandleProps {
  id: string;
  className?: string;
}

const DragHandle: React.FC<DragHandleProps> = ({ id, className = '' }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
    data: { type: 'row' },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex cursor-grab items-center justify-center rounded p-2 transition-colors hover:bg-gray-100 active:cursor-grabbing ${className} ${isDragging ? 'bg-blue-100' : ''}`}
      {...attributes}
      {...listeners}
      onMouseDown={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
    >
      <GripIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
    </div>
  );
};

// Sortable Table Row Component
interface SortableTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
  dragDropConfig?: DragDropConfig;
}

const SortableTableRow = React.forwardRef<HTMLTableRowElement, SortableTableRowProps>(
  ({ id, dragDropConfig, className, children, ...props }, ref) => {
    if (!dragDropConfig?.enabled) {
      return (
        <tr ref={ref} className={className} {...props}>
          {children}
        </tr>
      );
    }

    const { setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <tr
        ref={node => {
          setNodeRef(node);
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        style={style}
        className={`${className} ${isDragging ? 'z-50 bg-gray-100' : 'hover:bg-gray-50'}`}
        {...props}
      >
        {children}
      </tr>
    );
  }
);
SortableTableRow.displayName = 'SortableTableRow';

// Enhanced Table Components
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { dragDropConfig?: DragDropConfig }
>(({ className, dragDropConfig, children, ...props }, ref) => (
  <div
    className={`relative max-h-[400px] w-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 ${className}`}
  >
    <table ref={ref} className={`w-full caption-bottom text-sm`} {...props}>
      {children}
    </table>
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { dragDropConfig?: DragDropConfig }
>(({ className, dragDropConfig, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={`sticky top-0 z-10 bg-[#e9ecef] [&_tr]:border-b ${className}`}
    {...props}
  >
    {children}
  </thead>
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { dragDropConfig?: DragDropConfig }
>(({ className, dragDropConfig, children, ...props }, ref) => {
  const [_activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setTimeout(() => {
      setActiveId(null);
    }, 0);

    if (!over || active.id === over.id || !dragDropConfig) return;

    const oldIndex = dragDropConfig.items.findIndex(
      (item, index) => dragDropConfig.getItemId(item, index) === active.id
    );
    const newIndex = dragDropConfig.items.findIndex(
      (item, index) => dragDropConfig.getItemId(item, index) === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(dragDropConfig.items, oldIndex, newIndex);
      setTimeout(() => {
        dragDropConfig.onReorder(newItems);
      }, 0);
    }
  };

  if (!dragDropConfig?.enabled) {
    return (
      <tbody
        ref={ref}
        className={`divide-y divide-gray-200 bg-white [&_tr:last-child]:border-0 ${className}`}
        {...props}
      >
        {children}
      </tbody>
    );
  }

  const itemIds = dragDropConfig.items.map((item, index) => dragDropConfig.getItemId(item, index));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <tbody
          ref={ref}
          className={`divide-y divide-gray-200 bg-white [&_tr:last-child]:border-0 ${className}`}
          {...props}
        >
          {children}
        </tbody>
      </SortableContext>
    </DndContext>
  );
});
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`bg-muted/50 sticky right-0 bottom-0 w-full border-t font-medium [&>tr]:last:border-b-0 ${className}`}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    dragDropConfig?: DragDropConfig;
    dragId?: string;
  }
>(({ className, dragDropConfig, dragId, ...props }, ref) => {
  if (dragDropConfig?.enabled && dragId) {
    return (
      <SortableTableRow
        ref={ref}
        id={dragId}
        dragDropConfig={dragDropConfig}
        className={`data-[state=selected]:bg-muted w-full rounded border-b border-gray-300 duration-150 last:border-b-0 ${className}`}
        {...props}
      />
    );
  }

  return (
    <tr
      ref={ref}
      className={`hover:bg-muted/50 data-[state=selected]:bg-muted w-full rounded border-b border-gray-300 duration-150 last:border-b-0 ${className}`}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`text-darker-grey bg-slate-50 text-xs font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${className}`}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableData = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    dragDropConfig?: DragDropConfig;
    dragId?: string;
    isDragHandle?: boolean;
  }
>(({ className, dragDropConfig, dragId, isDragHandle, children, ...props }, ref) => {
  if (isDragHandle && dragDropConfig?.enabled && dragId) {
    return (
      <td
        ref={ref}
        className={`px-4 py-1 pl-[17px] text-xs font-light whitespace-nowrap text-gray-700 ${className}`}
        {...props}
      >
        <DragHandle id={dragId} />
      </td>
    );
  }

  return (
    <td
      ref={ref}
      className={`px-4 py-1 pl-[17px] text-xs font-light whitespace-nowrap text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
});
TableData.displayName = 'TableData';

// Rest of the components remain the same
export enum TableAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

type TableCellProps = {
  align?: TableAlign;
  children?: React.ReactNode;
  className?: string;
};

export const TableCell = ({
  align = TableAlign.LEFT,
  children,
  className,
}: TableCellProps): React.JSX.Element => {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align as 'left' | 'center' | 'right'];

  return (
    <div className={`px-4 py-1 text-xs whitespace-nowrap ${alignmentClass} ${className}`}>
      {children}
    </div>
  );
};

interface TableActionButtonsProps {
  children: React.ReactNode;
  className?: string;
}

export const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  children,
  className = '',
}) => {
  return <div className={`space-x-2 ${className}`}>{children}</div>;
};

const TableSkeleton = () => {
  return (
    <td colSpan={12} className="px-3 py-1">
      <div className="mx-auto h-8 w-full animate-pulse rounded bg-gray-300"></div>
    </td>
  );
};

const TableSkeletonRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className="w-full animate-pulse rounded border-b border-gray-300 transition duration-150 ease-in-out last:border-b-0">
      {children}
    </tr>
  );
};

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={`text-muted-foreground mt-4 text-sm ${className}`} {...props} />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
  TableCaption,
  TableSkeleton,
  TableSkeletonRow,
  DragHandle,
  GripIcon,
  type DragDropConfig,
};

export const TablePagination = <TData,>({
  table,
  className = '',
  isDisabled = false,
}: {
  table: TanstackTable<TData>;
  className?: string;
  isDisabled?: boolean;
}) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-tl-none rounded-tr-none bg-white px-4 py-3 ${className}`}
    >
      <div className="flex items-center gap-1">
        <Button
          className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronsLeft className="font-bold text-black" />}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || isDisabled}
        />

        <Button
          className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronLeft className="font-bold text-black" />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isDisabled}
        />

        {visiblePages.map(page => (
          <Button
            key={page}
            onClick={() => table.setPageIndex(page - 1)}
            size={Button.Size.ICON}
            roundness={Button.Roundness.FULL}
            variant={currentPage === page ? Button.Variant.PRIMARY : Button.Variant.SECONDARY}
            disabled={isDisabled}
          >
            {page}
          </Button>
        ))}

        <Button
          className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronRight className="font-bold text-black" />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isDisabled}
        />

        <Button
          className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
          size={Button.Size.ICON}
          roundness={Button.Roundness.FULL}
          variant={Button.Variant.OUTLINE}
          icon={<Icons.ChevronsRight className="font-bold text-black" />}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage() || isDisabled}
        />
      </div>
    </div>
  );
};

// // below is the code for simple table componenet without drag and drop

// import * as React from 'react';
// import { Button } from '../Button';
// import { Icons } from '@/components/Icons';
// import { type Table as TanstackTable } from '@tanstack/react-table';

// const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
//   ({ className, ...props }, ref) => (
//     <div
//       className={`relative max-h-[400px] w-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 ${className}`}
//     >
//       <table ref={ref} className={`w-full caption-bottom text-sm`} {...props} />
//     </div>
//   )
// );
// Table.displayName = 'Table';

// const TableHeader = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <thead
//     ref={ref}
//     className={`sticky top-0 z-10 bg-[#e9ecef] [&_tr]:border-b ${className}`}
//     {...props}
//   />
// ));
// TableHeader.displayName = 'TableHeader';

// const TableBody = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tbody
//     ref={ref}
//     className={`divide-y divide-gray-200 bg-white [&_tr:last-child]:border-0 ${className}`}
//     {...props}
//   />
// ));
// TableBody.displayName = 'TableBody';

// const TableFooter = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tfoot
//     ref={ref}
//     className={`bg-muted/50 sticky right-0 bottom-0 w-full border-t font-medium [&>tr]:last:border-b-0 ${className}`}
//     {...props}
//   />
// ));
// TableFooter.displayName = 'TableFooter';

// const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
//   ({ className, ...props }, ref) => (
//     <tr
//       ref={ref}
//       className={`last:border-b-0hover:bg-muted/50 data-[state=selected]:bg-muted durati on-150 w-full rounded border-b border-gray-300 ${className}`}
//       {...props}
//     />
//   )
// );
// TableRow.displayName = 'TableRow';

// const TableHead = React.forwardRef<
//   HTMLTableCellElement,
//   React.ThHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <th
//     ref={ref}
//     className={`text-darker-grey bg-slate-50 text-xs font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${className}`}
//     {...props}
//   />
// ));
// TableHead.displayName = 'TableHead';

// const TableData = React.forwardRef<
//   HTMLTableCellElement,
//   React.TdHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <td
//     ref={ref}
//     className={`-z-50 px-4 py-1 pl-[17px] text-xs font-light whitespace-nowrap text-gray-700 ${className}`}
//     {...props}
//   />
// ));
// TableData.displayName = 'TableData';

// export enum TableAlign {
//   LEFT = 'left',
//   CENTER = 'center',
//   RIGHT = 'right',
// }

// type TableCellProps = {
//   align?: TableAlign;
//   children?: React.ReactNode;
//   className?: string;
// };

// export const TableCell = ({
//   align = TableAlign.LEFT,
//   children,
//   className,
// }: TableCellProps): React.JSX.Element => {
//   const alignmentClass = {
//     left: 'text-left',
//     center: 'text-center',
//     right: 'text-right',
//   }[align as 'left' | 'center' | 'right'];

//   return (
//     <div className={`px-4 py-1 text-xs whitespace-nowrap ${alignmentClass} ${className}`}>
//       {children}
//     </div>
//   );
// };

// interface TableActionButtonsProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export const TableActionButtons: React.FC<TableActionButtonsProps> = ({
//   children,
//   className = '',
// }) => {
//   return <div className={`space-x-2 ${className}`}>{children}</div>;
// };

// const TableSkeleton = () => {
//   return (
//     <td colSpan={12} className="px-3 py-1">
//       <div className="mx-auto h-8 w-full animate-pulse rounded bg-gray-300"></div>
//     </td>
//   );
// };

// const TableSkeletonRow = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <tr className="w-full animate-pulse rounded border-b border-gray-300 transition duration-150 ease-in-out last:border-b-0">
//       {children}
//     </tr>
//   );
// };

// const TableCaption = React.forwardRef<
//   HTMLTableCaptionElement,
//   React.HTMLAttributes<HTMLTableCaptionElement>
// >(({ className, ...props }, ref) => (
//   <caption ref={ref} className={`text-muted-foreground mt-4 text-sm ${className}`} {...props} />
// ));
// TableCaption.displayName = 'TableCaption';

// export {
//   Table,
//   TableHeader,
//   TableBody,
//   TableFooter,
//   TableHead,
//   TableRow,
//   TableData,
//   TableCaption,
//   TableSkeleton,
//   TableSkeletonRow,
// };

// export const TablePagination = <TData,>({
//   table,
//   className = '',
//   isDisabled = false,
// }: {
//   table: TanstackTable<TData>;
//   className?: string;
//   isDisabled?: boolean;
// }) => {
//   const currentPage = table.getState().pagination.pageIndex + 1;
//   const totalPages = table.getPageCount();

//   const getVisiblePages = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const start = Math.max(1, currentPage - 2);
//       const end = Math.min(totalPages, currentPage + 2);

//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }

//     return pages;
//   };

//   const visiblePages = getVisiblePages();

//   if (totalPages <= 1) {
//     return null;
//   }

//   return (
//     <div
//       className={`flex items-center justify-center rounded-tl-none rounded-tr-none bg-white px-4 py-3 ${className}`}
//     >
//       <div className="flex items-center gap-1">
//         <Button
//           className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
//           size={Button.Size.ICON}
//           roundness={Button.Roundness.FULL}
//           variant={Button.Variant.OUTLINE}
//           icon={<Icons.ChevronsLeft className="font-bold text-black" />}
//           onClick={() => table.setPageIndex(0)}
//           disabled={!table.getCanPreviousPage() || isDisabled}
//         />

//         <Button
//           className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
//           size={Button.Size.ICON}
//           roundness={Button.Roundness.FULL}
//           variant={Button.Variant.OUTLINE}
//           icon={<Icons.ChevronLeft className="font-bold text-black" />}
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage() || isDisabled}
//         />

//         {visiblePages.map(page => (
//           <Button
//             key={page}
//             onClick={() => table.setPageIndex(page - 1)}
//             size={Button.Size.ICON}
//             roundness={Button.Roundness.FULL}
//             variant={currentPage === page ? Button.Variant.PRIMARY : Button.Variant.SECONDARY}
//             disabled={isDisabled}
//           >
//             {page}
//           </Button>
//         ))}

//         <Button
//           className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
//           size={Button.Size.ICON}
//           roundness={Button.Roundness.FULL}
//           variant={Button.Variant.OUTLINE}
//           icon={<Icons.ChevronRight className="font-bold text-black" />}
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage() || isDisabled}
//         />

//         <Button
//           className="!border-gray-400 !text-gray-900 hover:!border-gray-600"
//           size={Button.Size.ICON}
//           roundness={Button.Roundness.FULL}
//           variant={Button.Variant.OUTLINE}
//           icon={<Icons.ChevronsRight className="font-bold text-black" />}
//           onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//           disabled={!table.getCanNextPage() || isDisabled}
//         />
//       </div>
//     </div>
//   );
// };
