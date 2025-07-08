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
import { WarehouseService } from '@/services/warehouse-services';
import { IWarehouseDropdown } from '@/types/warehouse'; // Interface defined below

interface IWarehouseDropdownProps extends IDropdownOption<IWarehouseDropdown, string> {}

export const WarehouseDropdown: React.FC<IWarehouseDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select warehouse...',
  isDisabled = false,
  hasError = false,
  error,
  className,
  isRequired = false,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const fetchWarehouses = useCallback(
    (signal: AbortSignal) => WarehouseService.getAllWarehouses(signal),
    []
  );

  const { data: warehouseResponse, isLoading } =
    useFetch<ApiResponse<IWarehouseDropdown[]>>(fetchWarehouses);

  const warehouses = useMemo(() => warehouseResponse?.data ?? [], [warehouseResponse]);

  const filteredWarehouses = useMemo(() => {
    if (!searchTerm.trim()) return warehouses;

    const searchLower = searchTerm.toLowerCase();
    return warehouses.filter(wh => `${wh.name} ${wh.code}`.toLowerCase().includes(searchLower));
  }, [warehouses, searchTerm]);

  const selectedWarehouse = useMemo(() => {
    return warehouses.find(w => w._id === value);
  }, [value, warehouses]);

  const handleSelectWarehouse = (warehouse: IWarehouseDropdown) => {
    onSelect?.(warehouse);
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
    <DropdownDialog isOpen={isToggled} className={`${className} w-full`} ref={dialogRef}>
      <DropdownTrigger
        selectedItems={value ? [value] : []}
        label="Warehouse"
        isRequired={isRequired}
        placeholder={placeholder}
        toggleDropdown={handleToggleDropdown}
        renderSelected={() =>
          selectedWarehouse ? `${selectedWarehouse.name} (${selectedWarehouse.code})` : ''
        }
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
          placeholder="Search warehouse..."
        />

        <DropdownList>
          {!isLoading && filteredWarehouses.length === 0 && (
            <DropdownEmpty message="No warehouses found" />
          )}

          {filteredWarehouses.map(warehouse => (
            <DropdownItem
              key={warehouse._id}
              onClick={() => handleSelectWarehouse(warehouse)}
              isSelected={warehouse._id === value}
            >
              <DropdownItemName>{`${warehouse.name} (${warehouse.code})`}</DropdownItemName>
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
