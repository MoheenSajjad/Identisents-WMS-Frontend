import { useEffect, useState } from 'react';
import {
  AddNewButton,
  DeleteIconButton,
  EditIconButton,
  ReloadButton,
} from '@/components/parts/Buttons';
import { TableSearchInput } from '@/components/parts/search-input';
import { Map } from '@/components/ui/map';
import { Paper } from '@/components/ui/Paper';
import { Table, TableSkeleton } from '@/components/ui/Table';
import { ICompany } from '@/types/company';
import { usePagination } from '@/hooks/usePagination';
import { useApi } from '@/hooks/use-api';
import { companyService } from '@/services/company-services';
import { Avatar, AvatarSize, AvatarVariant } from '@/components/ui/avatar';
import { NoDataBoundary } from '@/components/ui/no-data-boundary';
import { DateTime } from '@/utils/date-time';
import { LoadingBoundary } from '@/components/ui/loading-boundary';
import { Tooltip, TooltipPosition } from '@/components/ui/tooltip';

export const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: companies,
    pagination,
    filters,
    loading,
    error,
    fetchData,
    goToPage,
  } = usePagination<ICompany>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { execute: deleteCompany, loading: deleteLoading } = useApi();

  useEffect(() => {
    fetchData(companyService.getCompanies);
  }, [filters]);

  const handleSort = (column: string) => {
    filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await deleteCompany(() => companyService.deleteCompany(companyId));

      fetchData(companyService.getCompanies);
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const handleReload = () => {
    fetchData(companyService.getCompanies);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 0;
  const totalItems = pagination?.total || 0;

  return (
    <Paper>
      <Paper.BigTitle title="Companies">
        <div className="flex gap-2">
          <ReloadButton onClick={handleReload} />
          <AddNewButton />
        </div>
      </Paper.BigTitle>

      <TableSearchInput
        placeholder="Search by Name, Url, Server Name and Database"
        value={searchTerm}
        onChange={handleSearchChange}
        isDisabled={loading}
      />

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sortable
              onSort={() => handleSort('name')}
              className={filters.sortBy === 'name' ? 'bg-gray-100' : ''}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell sortable onSort={() => handleSort('serverUrl')}>
              Url
            </Table.HeaderCell>
            <Table.HeaderCell sortable onSort={() => handleSort('databaseId')}>
              Server
            </Table.HeaderCell>
            <Table.HeaderCell>Database</Table.HeaderCell>
            <Table.HeaderCell sortable onSort={() => handleSort('createdAt')}>
              Created
            </Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <LoadingBoundary isLoading={loading} fallback={<TableSkeleton />}>
            <NoDataBoundary
              condition={Array.isArray(dummyCompanies) && dummyCompanies.length > 0}
              fallback={<Table.Empty title="No Companies Found" />}
            >
              <Map
                items={dummyCompanies}
                renderItem={(company: ICompany) => {
                  return (
                    <Table.Row key={company.id} className={loading ? 'opacity-50' : ''}>
                      <Table.Cell>
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={company.logoUrl}
                            name={company.name}
                            size={AvatarSize.MD}
                            variant={AvatarVariant.CIRCLE}
                            fallbackSrc="/default-company-logo.png"
                            className=""
                          />
                          <span className="font-medium">{company.name}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{company.serverUrl}</Table.Cell>
                      <Table.Cell>{company.databaseId}</Table.Cell>
                      <Table.Cell>
                        <span className="font-mono text-sm">
                          {'•'.repeat(company.password.length)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{DateTime.formatDate(company.createdAt)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <Tooltip position={TooltipPosition.TOP} content="Delete">
                            <DeleteIconButton
                              onClick={() => handleDelete(company.id)}
                              isDisabled={loading || deleteLoading}
                              isLoading={deleteLoading}
                            />
                          </Tooltip>
                          <Tooltip position={TooltipPosition.TOP} content="Edit">
                            <EditIconButton
                              onClick={() => {
                                console.log('Edit company:', company.id);
                              }}
                              isDisabled={loading || deleteLoading}
                            />
                          </Tooltip>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              />
            </NoDataBoundary>
          </LoadingBoundary>
        </Table.Body>
      </Table>

      {
        <Table.Pagination
          currentPage={4}
          totalPages={10}
          totalItems={15}
          onPageChange={handlePageChange}
          isDisabled={loading}
        />
      }
    </Paper>
  );
};

const dummyCompanies: ICompany[] = [
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
  {
    id: 'dummy-1',
    name: 'Dummy Company',
    serverUrl: 'https://dummyserver.com',
    databaseId: 'dummy-db',
    password: 'dummyPassword',
    createdAt: new Date().toISOString(),
    logoUrl: '',
  },
];
