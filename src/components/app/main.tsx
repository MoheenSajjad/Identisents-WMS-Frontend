import { Dashboard } from '@/pages/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '../layout';
import { Companies } from '@/pages/companies';
import { Warehouses } from '@/pages/warehouses';

export const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};
