import { useToggle } from '@/hooks/use-toggle';
import {
  DropdownContent,
  DropdownDialog,
  DropdownEmpty,
  DropdownInput,
  DropdownItem,
  DropdownItemName,
  DropdownLabel,
  DropdownList,
  DropdownTrigger,
} from '../../dropdown/Dropdown';
import { useCallback, useState, useMemo, useRef } from 'react';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { ISAPWarehouses } from '@/types/warehouse';
import { ApiResponse } from '@/types/api';
import { SAPServices } from '@/services/sap-services';
import { Input } from '@/components/ui/input';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { IDropdownOption } from '@/types/dropdown';

interface ISapWarehousesDropdownProps extends IDropdownOption<string[], string[]> {
  companyId?: string;
}

export const SapWarehousesDropdown: React.FC<ISapWarehousesDropdownProps> = ({
  value = [],
  onSelect,
  placeholder = 'Select warehouses...',
  isDisabled = false,
  hasError = false,
  isRequired = false,
  companyId,
  error,
  className,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const fetchSAPWarehouses = useCallback(
    (signal: AbortSignal) => SAPServices.getSAPWarehouses(companyId ?? '', signal),
    [companyId]
  );

  const { data: sapWarehousesResponse, isLoading } = useFetch<ApiResponse<ISAPWarehouses[]>>(
    fetchSAPWarehouses,
    {
      enabled: !!companyId,
    }
  );

  console.log('companyId', companyId);

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
      onSelect?.(updatedSelection);
    } else {
      onSelect?.([...value, warehouse.WarehouseCode]);
    }
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

  useOnClickOutside(dialogRef, () => toggleOff());
  return (
    <DropdownDialog isOpen={isToggled} className={className} ref={dialogRef}>
      <DropdownLabel label="SAP Warehouses" isRequired={isRequired} />
      <DropdownTrigger
        selectedItems={value}
        placeholder={placeholder}
        toggleDropdown={handleToggleDropdown}
        renderSelected={renderSelectedWarehouse}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        hasError={hasError}
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
