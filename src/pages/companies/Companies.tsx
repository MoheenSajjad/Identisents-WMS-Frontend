import {
  AddNewButton,
  DeleteIconButton,
  EditIconButton,
  ReloadButton,
} from '@/components/parts/Buttons';
import { TableSearchInput } from '@/components/parts/search-input';
import { Button } from '@/components/ui/Button';
import { Map } from '@/components/ui/map';
import { Paper } from '@/components/ui/Paper';
import { Table } from '@/components/ui/Table';
import { TextInput } from '@/components/ui/text-input';

interface ICompany {
  name: string;
  databaseId: string;
  serverUrl: string;
  password: string;
  logoUrl: string;
  createdAt: string;
}
export const Companies = () => {
  const companies: ICompany[] = [
    {
      name: 'Acme Corp',
      databaseId: 'acme_db_001',
      serverUrl: 'https://server.acme.com',
      password: 'securepass123',
      logoUrl: 'https://example.com/logo.png',
      createdAt: '2024-01-01T12:00:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },

    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },

    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },

    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
    {
      name: 'Globex Ltd.',
      databaseId: 'globex_2023',
      serverUrl: 'https://db.globex.com',
      password: 'pass456',
      logoUrl: 'https://example.com/globex-logo.png',
      createdAt: '2023-07-15T08:30:00Z',
    },
  ];
  return (
    <Paper>
      <Paper.BigTitle title="Companies">
        <div className="flex gap-2">
          <ReloadButton />
          <AddNewButton />
        </div>
      </Paper.BigTitle>
      <TableSearchInput placeholder="Search by Name, Url, Server Name and Database" />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sortable>Name</Table.HeaderCell>
            <Table.HeaderCell>Url</Table.HeaderCell>
            <Table.HeaderCell>Server</Table.HeaderCell>
            <Table.HeaderCell>Database</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Map
            items={companies}
            renderItem={(company: ICompany) => {
              return (
                <Table.Row>
                  <Table.Cell>{company.name}</Table.Cell>
                  <Table.Cell>{company.serverUrl}</Table.Cell>
                  <Table.Cell>{company.databaseId}</Table.Cell>
                  <Table.Cell>{company.password}</Table.Cell>
                  <Table.Cell>
                    <EditIconButton />
                    <DeleteIconButton />
                  </Table.Cell>
                </Table.Row>
              );
            }}
          />
        </Table.Body>
      </Table>
    </Paper>
  );
};
