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
import { useMemo, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/use-click-outside';
import { IDropdownOption } from '@/types/dropdown';
import { IBinSubLevelRows } from '@/types/bin-sub-levels';

interface IBinSubLevelRowsDropdownProps extends IDropdownOption<IBinSubLevelRows, string> {
  label?: string;
  options?: IBinSubLevelRows[];
  isLoading?: boolean;
  showLabel?: boolean;
}

export const BinSubLevelRowsDropdown: React.FC<IBinSubLevelRowsDropdownProps> = ({
  value,
  label,
  onSelect,
  placeholder = 'Select bin sub level row...',
  isDisabled = false,
  hasError = false,
  error,
  className,
  options = [],
  showLabel = true,
  isRequired = false,
  isLoading = false,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const binSubLevelRows = useMemo(() => options, [options]);

  const filteredBinSubLevelRows = useMemo(() => {
    if (!searchTerm.trim()) return binSubLevelRows;

    const searchLower = searchTerm.toLowerCase();
    return binSubLevelRows.filter(
      row =>
        row.code?.toLowerCase().includes(searchLower) ||
        row.name?.toLowerCase().includes(searchLower) ||
        row.serialNumber?.toString().includes(searchLower)
    );
  }, [binSubLevelRows, searchTerm]);

  const selectedBinSubLevelRow = useMemo(() => {
    return binSubLevelRows.find(row => row.code === value);
  }, [value, binSubLevelRows]);

  const handleSelectBinSubLevelRow = (row: IBinSubLevelRows) => {
    onSelect?.(row);
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

  const renderSelectedValue = () => {
    if (!selectedBinSubLevelRow) return '';

    const parts = [];
    if (selectedBinSubLevelRow.code) parts.push(selectedBinSubLevelRow.code);
    if (selectedBinSubLevelRow.name) parts.push(selectedBinSubLevelRow.name);
    if (selectedBinSubLevelRow.serialNumber) parts.push(`#${selectedBinSubLevelRow.serialNumber}`);

    return parts.join(' - ');
  };

  return (
    <DropdownDialog isOpen={isToggled} className={`${className} w-full`} ref={dialogRef}>
      <DropdownTrigger
        selectedItems={value ? [value] : []}
        label={label ?? 'Bin Sub Level Row'}
        isRequired={isRequired}
        placeholder={placeholder}
        toggleDropdown={handleToggleDropdown}
        renderSelected={renderSelectedValue}
        isLoading={isLoading}
        showLabel={showLabel}
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
          placeholder="Search by code or name..."
        />

        <DropdownList>
          {!isLoading && filteredBinSubLevelRows.length === 0 && (
            <DropdownEmpty message="No bin sub level rows found" />
          )}

          {filteredBinSubLevelRows.map((row, index) => {
            const displayText = [];
            if (row.code) displayText.push(row.code);
            if (row.name) displayText.push(row.name);

            return (
              <DropdownItem
                key={`${row.code}-${index}`}
                onClick={() => handleSelectBinSubLevelRow(row)}
                isSelected={row.code === value}
              >
                <DropdownItemName>
                  <div className="flex flex-col">
                    <span className="font-medium">{displayText.join(' - ')}</span>
                  </div>
                </DropdownItemName>
              </DropdownItem>
            );
          })}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
