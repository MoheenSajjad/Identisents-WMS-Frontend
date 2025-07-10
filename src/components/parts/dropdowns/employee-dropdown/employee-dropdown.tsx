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
import { EmployeeService } from '@/services/employee-services';
import { IEmployeeDropdown } from '@/types/employee';

interface IEmployeeDropdownProps extends IDropdownOption<IEmployeeDropdown, string> {
  showLabel?: boolean;
}

export const EmployeeDropdown: React.FC<IEmployeeDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select employee...',
  isDisabled = false,
  hasError = false,
  error,
  className,
  isRequired = false,
  showLabel = true,
}) => {
  const { isToggled, toggle, toggleOff } = useToggle();
  const [searchTerm, setSearchTerm] = useState('');
  const dialogRef = useRef<any>(null);

  const fetchEmployees = useCallback(
    (signal: AbortSignal) => EmployeeService.getAllEmployees(signal),
    []
  );

  const { data: employeeResponse, isLoading } =
    useFetch<ApiResponse<IEmployeeDropdown[]>>(fetchEmployees);

  const employees = useMemo(() => employeeResponse?.data ?? [], [employeeResponse]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;

    const searchLower = searchTerm.toLowerCase();
    return employees.filter(e =>
      `${e.employeeName} ${e.employeeCode}`.toLowerCase().includes(searchLower)
    );
  }, [employees, searchTerm]);

  const selectedEmployee = useMemo(() => {
    return employees.find(e => e._id === value);
  }, [value, employees]);

  const handleSelectEmployee = (employee: IEmployeeDropdown) => {
    onSelect?.(employee);
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
        label="Employee"
        isRequired={isRequired}
        showLabel={showLabel}
        toggleDropdown={handleToggleDropdown}
        renderSelected={() =>
          selectedEmployee
            ? `${selectedEmployee.employeeName} (${selectedEmployee.employeeCode})`
            : ''
        }
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
          placeholder="Search employee..."
        />

        <DropdownList>
          {!isLoading && filteredEmployees.length === 0 && (
            <DropdownEmpty message="No employees found" />
          )}

          {filteredEmployees.map(emp => (
            <DropdownItem
              key={emp._id}
              onClick={() => handleSelectEmployee(emp)}
              isSelected={emp._id === value}
            >
              <DropdownItemName>{`${emp.employeeName} (${emp.employeeCode})`}</DropdownItemName>
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
