import { Icons } from '@/components/Icons';
import { TextInput } from '@/components/ui/text-input';

interface ITableSearchInput {
  placeholder?: string;
}
export const TableSearchInput = ({ placeholder = 'Search...' }: ITableSearchInput) => {
  return (
    <TextInput
      borderClassName="rounded-br-none rounded-bl-none border-gray-200 border-b-0 h-10"
      className="w-full"
      icon={<Icons.Search className="text-gray-400" />}
      placeholder={placeholder}
    />
  );
};
