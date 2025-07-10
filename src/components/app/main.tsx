import { Dashboard } from '@/pages/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '../layout';
import { Companies } from '@/pages/companies';
import { Warehouses } from '@/pages/warehouses';
import { BinSubLevels } from '@/pages/bin-sub-levels';
import { BinLocation } from '@/pages/bin-locations';
import { JobAssignment } from '@/pages/job-assignement';
import { JobDetail } from '@/pages/job-detail/JobDetail';
import { CreateBinLocation } from '@/pages/create-bin-location';
import { Employees } from '@/pages/employees';
import { Login } from '@/pages/login';
import ProtectedRoute from './ProtectedRoute';

export const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/bin-sub-levels" element={<BinSubLevels />} />
            <Route path="/bin-locations" element={<BinLocation />} />
            <Route path="/bin-location/create" element={<CreateBinLocation />} />
            <Route path="/jobs" element={<JobAssignment />} />
            <Route path="/job/:id" element={<JobDetail />} />

            <Route index element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
