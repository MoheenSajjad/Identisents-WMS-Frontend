import { Icons } from '@/components/Icons';
import { TextInput } from '@/components/ui/text-input';

interface ITableSearchInput {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}
export const TableSearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  isDisabled = false,
}: ITableSearchInput) => {
  return (
    <TextInput
      borderClassName="rounded-br-none rounded-bl-none border-gray-200 border-b-0 h-10"
      className="w-full"
      onChange={onChange}
      value={value}
      icon={<Icons.Search className="text-gray-400" />}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  );
};
