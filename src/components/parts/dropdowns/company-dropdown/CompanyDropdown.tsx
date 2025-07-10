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
import { ICompanyDropdown } from '@/types/company';
import { CompanyService } from '@/services/company-services';
import { ApiResponse } from '@/types/api';
import { IDropdownOption } from '@/types/dropdown';

interface ICompanyDropdownProps extends IDropdownOption<ICompanyDropdown, string> {
  showLabel?: boolean;
}

export const CompanyDropdown: React.FC<ICompanyDropdownProps> = ({
  value,
  onSelect,
  placeholder = 'Select company...',
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

  const selectedCompany = useMemo(() => {
    return companies.find(c => c._id === value);
  }, [value, companies]);

  const handleSelectCompany = (company: ICompanyDropdown) => {
    onSelect?.(company);
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
        label="Company"
        isRequired={isRequired}
        showLabel={showLabel}
        toggleDropdown={handleToggleDropdown}
        renderSelected={() => (selectedCompany ? selectedCompany.name : '')}
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
          placeholder="Search company..."
        />

        <DropdownList>
          {!isLoading && filteredCompanies.length === 0 && (
            <DropdownEmpty message="No companies found" />
          )}

          {filteredCompanies.map(company => (
            <DropdownItem
              key={company._id}
              onClick={() => handleSelectCompany(company)}
              isSelected={company._id === value}
            >
              <DropdownItemName>{company.name}</DropdownItemName>
            </DropdownItem>
          ))}
        </DropdownList>
      </DropdownContent>
    </DropdownDialog>
  );
};
