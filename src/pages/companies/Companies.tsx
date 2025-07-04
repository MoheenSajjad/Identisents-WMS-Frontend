import { DataTable } from '@/components/parts/Datatable';
import { Paper } from '@/components/ui/Paper';
import { useDataTable } from '@/hooks/use-data-tabel';
import { ICompany } from '@/types/company';
import { getColumns } from './columns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableToolbar } from '@/components/parts/Datatable/DatatableToolbar';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { CompanyService } from '@/services/company-services';
import { AddNewButton, ReloadButton } from '@/components/parts/Buttons';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { PageTransition } from '@/components/parts/animations';
import { CreateCompany } from '@/components/parts/modals/create-company';
import { useToggle } from '@/hooks/use-toggle';

export const Companies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelecetdcompany] = useState<ICompany | null>(null);

  const columns = useMemo(
    () =>
      getColumns(
        company => {
          setSelecetdcompany(company);
          toggleOn();
        },
        company => handleDelete(company)
      ),
    []
  );

  function handleDelete(company: ICompany) {}

  const { isToggled, toggleOn, toggleOff } = useToggle();

  const fetchCompanies = useCallback(
    (signal: AbortSignal) => CompanyService.getCompanies(currentPage, signal),
    [currentPage]
  );

  const {
    data: companies,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PaginatedResponse<ICompany[]>>>(fetchCompanies);

  const { table, page } = useDataTable({
    data: companies?.data.records ?? [],
    columns,
    pageCount: companies?.data.pagination.totalPages || 1,
  });

  useEffect(() => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [page]);

  const handleOnSubmit = () => {
    toggleOff(), refetch();
  };
  return (
    <>
      <PageTransition>
        <Paper>
          <Paper.BigTitle title="Companies" />
          <DataTable table={table} isLoading={isLoading}>
            <DataTableToolbar table={table}>
              <ReloadButton onClick={refetch} />
              <AddNewButton onClick={toggleOn} />
            </DataTableToolbar>
          </DataTable>
        </Paper>
      </PageTransition>
      {isToggled && (
        <CreateCompany
          company={selectedCompany}
          mode={!!selectedCompany ? 'edit' : 'create'}
          onSubmit={handleOnSubmit}
          onCancel={toggleOff}
        />
      )}
    </>
  );
};
