import { useToggle } from '@/hooks/use-toggle';
import {
  DropdownContent,
  DropdownDialog,
  DropdownEmpty,
  DropdownInput,
  DropdownItem,
  DropdownItemName,
  DropdownList,
  DropdownSelected,
  DropdownTrigger,
} from '../../dropdown/Dropdown';
import { useCallback, useState, useMemo } from 'react';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { ISAPWarehouses } from '@/types/warehouse';
import { ApiResponse } from '@/types/api';
import { SAPServices } from '@/services/sap-services';
import { Input } from '@/components/ui/input';

interface ISapWarehousesDropdownProps {
  value?: string[];
  onValueChange?: (warehouses: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string;
  className?: string;
  isRequired?: boolean;
}

export const SapWarehousesDropdown: React.FC<ISapWarehousesDropdownProps> = ({
  value = [],
  onValueChange,
  placeholder = 'Select warehouses...',
  isDisabled = false,
  error,
  className,
  isRequired = false,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSAPWarehouses = useCallback(
    (signal: AbortSignal) => SAPServices.getSAPWarehouses('68414cccff22019299c5d764', signal),
    []
  );

  const {
    data: sapWarehousesResponse,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<ISAPWarehouses[]>>(fetchSAPWarehouses);

  const warehouses = useMemo(() => {
    if (!sapWarehousesResponse?.success || !sapWarehousesResponse?.data) {
      return [];
    }
    return sapWarehousesResponse.data;
  }, [sapWarehousesResponse]);

  const filteredWarehouses = useMemo(() => {
    if (!searchTerm.trim()) {
      return warehouses;
    }

    const searchLower = searchTerm.toLowerCase();
    return warehouses.filter(
      warehouse =>
        warehouse.WarehouseName.toLowerCase().includes(searchLower) ||
        warehouse.WarehouseCode.toLowerCase().includes(searchLower)
    );
  }, [warehouses, searchTerm]);

  const isWarehouseSelected = (warehouse: ISAPWarehouses) => {
    return value.some(selectedCode => selectedCode === warehouse.WarehouseCode);
  };

  const handleSelectWarehouse = (warehouse: ISAPWarehouses) => {
    if (isWarehouseSelected(warehouse)) {
      const updatedSelection = value.filter(
        selectedCode => selectedCode !== warehouse.WarehouseCode
      );
      onValueChange?.(updatedSelection);
    } else {
      onValueChange?.([...value, warehouse.WarehouseCode]);
    }
  };

  const handleRemoveWarehouse = (warehouse: ISAPWarehouses) => {
    console.log(`Removing warehouse: ${warehouse}`);

    const updatedSelection = value.filter(selectedCode => selectedCode !== warehouse.WarehouseCode);
    onValueChange?.(updatedSelection);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderSelectedWarehouse = (warehouseCode: string) => {
    const warehouse = warehouses.find(w => w.WarehouseCode === warehouseCode);
    if (warehouse) {
      return `${warehouse.WarehouseName} (${warehouse.WarehouseCode})`;
    }
    return '';
  };

  const handleToggleDropdown = () => {
    if (!isDisabled) {
      toggle();
      if (!isToggled) {
        setSearchTerm('');
      }
    }
  };

  const shouldShowEmpty =
    !isLoading &&
    (!sapWarehousesResponse?.success || warehouses.length === 0 || filteredWarehouses.length === 0);

  return (
    <DropdownDialog isOpen={isToggled} className={className}>
      <Input.Label value="Warehouses" isRequired={isRequired} />
      <DropdownTrigger
        selectedItems={value}
        placeholder={placeholder}
        toggleDropdown={handleToggleDropdown}
        renderSelected={renderSelectedWarehouse}
        onRemoveItem={handleRemoveWarehouse}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        hasError={!!error}
        error={error}
        isMultiple={true}
      />

      <DropdownContent isOpen={isToggled}>
        <DropdownInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search warehouses..."
        />

        <DropdownList>
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
                <span className="text-sm">Loading warehouses...</span>
              </div>
            </div>
          )}

          {shouldShowEmpty && <DropdownEmpty message="No warehouses found" />}

          {!isLoading &&
            sapWarehousesResponse?.success &&
            filteredWarehouses.length > 0 &&
            filteredWarehouses.map(warehouse => (
              <DropdownItem
                key={warehouse.WarehouseCode}
                onClick={() => handleSelectWarehouse(warehouse)}
                isSelected={isWarehouseSelected(warehouse)}
              >
                <DropdownItemName>
                  {`${warehouse.WarehouseName} (${warehouse.WarehouseCode})`}
                </DropdownItemName>
              </DropdownItem>
            ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
