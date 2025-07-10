import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { CompanyDropdown } from '../parts/dropdowns/company-dropdown';
import { useAuth } from '@/hooks/use-auth';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();

  const { logout } = useAuth();

  const handelLogout = () => {
    logout();
  };

  const searchRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/companies')) return 'Companies';
    if (path.startsWith('/employees')) return 'Employees';
    if (path.startsWith('/warehouses')) return 'Warehouses';
    if (path.startsWith('/bin-dub-levels')) return 'Bin Sub Levels';
    if (path.startsWith('/bin-locations')) return 'Bin Locations';
    if (path.startsWith('/jobs')) return 'Jobs';
    return 'Overview';
  };

  return (
    <header className="bg-[#ffffff]transition-colors border-b-[1px] border-l-[1px] border-gray-200">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            icon={<Menu size={18} />}
            variant={Button.Variant.GHOST}
            onClick={onMenuClick}
            roundness={Button.Roundness.FULL}
            size={Button.Size.ICON}
            className="p-2"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          />

          <div className="flex items-center space-x-1 text-sm text-black md:space-x-2">
            <span className="text-gray-500">Pages</span>
            <span className="text-gray-500">/</span>
            <span className="cursor-pointer font-semibold text-black">{getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={searchRef}>
            <div className="relative">{/* <CompanyDropdown showLabel={false} /> */}</div>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100" onClick={handelLogout}>
            <LogOut className="h-5 w-5 text-[#233558]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
