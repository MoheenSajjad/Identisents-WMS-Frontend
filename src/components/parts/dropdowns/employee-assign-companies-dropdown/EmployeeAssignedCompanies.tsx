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
import { ICompanyDropdown } from '@/types/company';
import { CompanyService } from '@/services/company-services';
import { ApiResponse } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';

interface IAssignedCompany {
  id: string;
  isDefault: boolean;
}

interface IAssignCompanyDropdownProps {
  value: IAssignedCompany[];
  onChange: (companies: IAssignedCompany[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  error?: string;
  className?: string;
  isRequired?: boolean;
  showLabel?: boolean;
}

export const EmployeeAssignCompanyDropdown: React.FC<IAssignCompanyDropdownProps> = ({
  value,
  onChange,
  placeholder = 'Select companies...',
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

  const fetchCompanies = useCallback(
    (signal: AbortSignal) => CompanyService.getAllCompanies(signal),
    []
  );

  const { data: companiesResponse, isLoading } =
    useFetch<ApiResponse<ICompanyDropdown[]>>(fetchCompanies);

  const companies = useMemo(() => companiesResponse?.data ?? [], [companiesResponse]);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    const searchLower = searchTerm.toLowerCase();
    return companies.filter(company => company.name.toLowerCase().includes(searchLower));
  }, [companies, searchTerm]);

  const isSelected = (id: string) => value.some(item => item.id === id);
  const isDefault = (id: string) => value.find(item => item.id === id)?.isDefault;

  const handleSelect = (company: ICompanyDropdown) => {
    if (isSelected(company._id)) {
      const updated = value.filter(item => item.id !== company._id);
      onChange(updated);
    } else {
      onChange([...value, { id: company._id, isDefault: false }]);
    }
  };

  const handleDefaultChange = (id: string) => {
    onChange(value.map(item => ({ ...item, isDefault: item.id === id })));
  };

  const renderSelected = () => {
    if (value.length === 0) return '';
    return `${value.length} compan${value.length === 1 ? 'y' : 'ies'} selected`;
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
        selectedItems={value.map(v => v.id)}
        placeholder={placeholder}
        label="Assigned Companies"
        isRequired={isRequired}
        showLabel={showLabel}
        toggleDropdown={handleToggleDropdown}
        renderSelected={renderSelected}
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
          placeholder="Search company..."
        />

        <DropdownList>
          {!isLoading && filteredCompanies.length === 0 && (
            <DropdownEmpty message="No companies found" />
          )}

          {filteredCompanies.map(company => (
            <DropdownItem
              key={company._id}
              onClick={() => handleSelect(company)}
              isSelected={isSelected(company._id)}
              showCheckMark={false}
            >
              <DropdownItemName>{company.name}</DropdownItemName>
              {isSelected(company._id) && (
                <div className="absolute right-3">
                  <Checkbox
                    checked={isDefault(company._id)}
                    onChange={() => handleDefaultChange(company._id)}
                    className="h-4 w-4 rounded-full border-gray-400"
                  />
                </div>
              )}
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
