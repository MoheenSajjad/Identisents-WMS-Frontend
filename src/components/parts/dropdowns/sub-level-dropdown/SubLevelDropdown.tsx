import { useToggle } from '@/hooks/use-toggle';
import {
  DropdownContent,
  DropdownDialog,
  DropdownEmpty,
  DropdownInput,
  DropdownItem,
  DropdownItemName,
  DropdownList,
  DropdownTrigger,
} from '../../dropdown/Dropdown';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { ApiResponse } from '@/types/api';
import { IDropdownOption } from '@/types/dropdown';
import { SubLevelService } from '@/services/sub-level-services';
import { ISubLevelDropdown } from '@/types/bin-sub-levels';

interface ISubLevelDropdownProps extends IDropdownOption<ISubLevelDropdown, string> {}

export const SubLevelDropdown: React.FC<ISubLevelDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select sub level...',
  isDisabled = false,
  hasError = false,
  error,
  className,
  isRequired = false,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const fetchSubLevels = useCallback(
    (signal: AbortSignal) => SubLevelService.getSubLevels(signal),
    []
  );

  const { data: subLevelsResponse, isLoading } =
    useFetch<ApiResponse<ISubLevelDropdown[]>>(fetchSubLevels);

  const subLevels = useMemo(() => subLevelsResponse?.data ?? [], [subLevelsResponse]);

  const filteredSubLevels = useMemo(() => {
    if (!searchTerm.trim()) return subLevels;

    const searchLower = searchTerm.toLowerCase();
    return subLevels.filter(sub => sub.name.toLowerCase().includes(searchLower));
  }, [subLevels, searchTerm]);

  const selectedSubLevel = useMemo(() => {
    return subLevels.find(s => s._id === value);
  }, [value, subLevels]);

  const handleSelectSubLevel = (subLevel: ISubLevelDropdown) => {
    onSelect?.(subLevel);
    toggleOff();
  };

  const handleToggleDropdown = () => {
    if (!isDisabled) {
      toggle();
      if (!isToggled) setSearchTerm('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useOnClickOutside(dialogRef, toggleOff);

  return (
    <DropdownDialog isOpen={isToggled} className={className} ref={dialogRef}>
      <DropdownTrigger
        selectedItems={value ? [value] : []}
        label="Sub Level"
        isRequired={isRequired}
        placeholder={placeholder}
        toggleDropdown={handleToggleDropdown}
        renderSelected={() => (selectedSubLevel ? selectedSubLevel.name : '')}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        hasError={hasError}
        error={error}
        isMultiple={false}
        className="w-full"
      />

      <DropdownContent isOpen={isToggled}>
        <DropdownInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search sub level..."
        />

        <DropdownList>
          {!isLoading && filteredSubLevels.length === 0 && (
            <DropdownEmpty message="No sub levels found" />
          )}

          {filteredSubLevels.map(sub => (
            <DropdownItem
              key={sub._id}
              onClick={() => handleSelectSubLevel(sub)}
              isSelected={sub._id === value}
            >
              <DropdownItemName>{sub.name}</DropdownItemName>
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
