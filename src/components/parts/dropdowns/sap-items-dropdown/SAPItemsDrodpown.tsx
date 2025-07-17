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
import { SAPServices } from '@/services/sap-services';

export interface ISAPItem {
  ItemCode: string;
  ItemName: string;
}

interface ISapItemsDropdownProps extends IDropdownOption<ISAPItem | null, string> {
  groupCode: string | null;
  companyId: string | null;
}

export const SapItemsDropdown: React.FC<ISapItemsDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select item...',
  isDisabled = false,
  hasError = false,
  isRequired = false,
  error,
  className,
  groupCode,
  companyId,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  console.log('value is ', value);

  const fetchSAPItems = useCallback(
    (signal: AbortSignal) =>
      SAPServices.getSAPItems({ companyId: companyId ?? '', GroupCode: groupCode ?? '' }, signal),
    [groupCode]
  );

  const { data: sapItemsResponse, isLoading } = useFetch<ApiResponse<ISAPItem[]>>(fetchSAPItems, {
    enabled: !!groupCode && !!companyId,
  });

  const items = useMemo(() => {
    if (!sapItemsResponse?.success || !sapItemsResponse?.data) return [];
    return sapItemsResponse.data;
  }, [sapItemsResponse]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(
      i => i.ItemName.toLowerCase().includes(lower) || i.ItemCode.toLowerCase().includes(lower)
    );
  }, [items, searchTerm]);

  const isItemSelected = (item: ISAPItem) => {
    return value === item.ItemCode;
  };

  const handleSelectItem = (item: ISAPItem) => {
    onSelect?.(item);
    toggleOff();
  };

  const renderSelectedItem = () => {
    const item = items.find(i => i.ItemCode === value);
    return item ? `${item.ItemName} (${item.ItemCode})` : '';
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

  const shouldShowEmpty =
    !isLoading && (!sapItemsResponse?.success || items.length === 0 || filteredItems.length === 0);

  useOnClickOutside(dialogRef, toggleOff);

  return (
    <DropdownDialog isOpen={isToggled} className={className} ref={dialogRef}>
      <DropdownTrigger
        selectedItems={value ? [value] : []}
        placeholder={placeholder}
        label="Item"
        isRequired={isRequired}
        toggleDropdown={handleToggleDropdown}
        renderSelected={renderSelectedItem}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        hasError={hasError}
        error={error}
        isMultiple={false}
        onRemoveItem={() => onSelect!(null)}
      />

      <DropdownContent isOpen={isToggled}>
        <DropdownInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search items..."
        />

        <DropdownList>
          {shouldShowEmpty && <DropdownEmpty message="No items found" />}

          {!isLoading &&
            sapItemsResponse?.success &&
            filteredItems.map(item => (
              <DropdownItem
                key={item.ItemCode}
                onClick={() => handleSelectItem(item)}
                isSelected={isItemSelected(item)}
              >
                <DropdownItemName>
                  {item.ItemName} ({item.ItemCode})
                </DropdownItemName>
              </DropdownItem>
            ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
