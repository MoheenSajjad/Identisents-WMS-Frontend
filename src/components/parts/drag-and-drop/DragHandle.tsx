import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripIcon } from './DragIcon';

// components/DragGripHandle.tsx - For table row drag handles
interface DragGripHandleProps {
  id: string;
  className?: string;
}

export const DragGripHandle: React.FC<DragGripHandleProps> = ({ id, className = '' }) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id,
    data: {
      type: 'row',
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex cursor-grab items-center justify-center active:cursor-grabbing ${className}`}
      {...attributes}
      {...listeners}
    >
      <GripIcon className="h-8 w-8 text-gray-400 hover:text-gray-600" />
    </div>
  );
};

// components/SortableTableRow.tsx - For table rows
interface SortableTableRowProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SortableTableRow: React.FC<SortableTableRowProps> = ({
  id,
  children,
  className = '',
}) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'z-50 bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      {children}
    </tr>
  );
};
