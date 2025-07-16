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
import { useCallback, useState, useMemo, useRef } from 'react';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { ApiResponse } from '@/types/api';
import { IDropdownOption } from '@/types/dropdown';
import { SAPServices } from '@/services/sap-services';

export interface ISAPItemGroup {
  Number: string;
  GroupName: string;
}

interface ISAPItemGroupsDropdownProps extends IDropdownOption<ISAPItemGroup, string> {
  showLabel?: boolean;
  companyId: string | null;
}

export const SAPItemGroupsDropdown: React.FC<ISAPItemGroupsDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select item group...',
  isDisabled = false,
  hasError = false,
  error,
  className,
  isRequired = false,
  showLabel = true,
  companyId,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const fetchItemGroups = useCallback(
    (signal: AbortSignal) => SAPServices.getSAPItemGroups(companyId ?? '', signal),
    [companyId]
  );

  const { data: response, isLoading } = useFetch<ApiResponse<ISAPItemGroup[]>>(fetchItemGroups, {
    enabled: !!companyId,
  });
  const itemGroups = useMemo(() => response?.data ?? [], [response]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return itemGroups;
    const searchLower = searchTerm.toLowerCase();
    return itemGroups.filter(group => group.GroupName.toLowerCase().includes(searchLower));
  }, [itemGroups, searchTerm]);

  const selectedGroup = useMemo(() => {
    return itemGroups.find(g => g.Number === value);
  }, [value, itemGroups]);

  const handleSelectGroup = (group: ISAPItemGroup) => {
    onSelect?.(group);
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
        placeholder={placeholder}
        label="Item Group"
        isRequired={isRequired}
        showLabel={showLabel}
        toggleDropdown={handleToggleDropdown}
        renderSelected={() => (selectedGroup ? selectedGroup.GroupName : '')}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        hasError={hasError}
        error={error}
        isMultiple={false}
      />

      <DropdownContent isOpen={isToggled}>
        <DropdownInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search item group..."
        />

        <DropdownList>
          {!isLoading && filteredGroups.length === 0 && (
            <DropdownEmpty message="No item groups found" />
          )}

          {filteredGroups.map(group => (
            <DropdownItem
              key={group.Number}
              onClick={() => handleSelectGroup(group)}
              isSelected={group.Number === value}
            >
              <DropdownItemName>{group.GroupName}</DropdownItemName>
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
