import { Dashboard } from '@/pages/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '../layout';
import { Companies } from '@/pages/companies';
import { Warehouses } from '@/pages/warehouses';
import { BinSubLevels } from '@/pages/bin-sub-levels';
import { BinLocation } from '@/pages/bin-locations';
import { JobAssignment } from '@/pages/job-assignement';

export const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/bin-sub-levels" element={<BinSubLevels />} />
          <Route path="/bin-locations" element={<BinLocation />} />
          <Route path="/jobs" element={<JobAssignment />} />
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};
