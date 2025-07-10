import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Settings, LogOut, Command } from 'lucide-react';
import { Button } from '../ui/Button';
import { CompanyDropdown } from '../parts/dropdowns/company-dropdown';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/api/placeholder/32/32',
    role: 'Administrator',
  });

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/companies')) return 'Companies';
    if (path.startsWith('/employees')) return 'Employees';
    if (path.startsWith('/warehouses')) return 'Warehouses';
    if (path.startsWith('/settings')) return 'Settings';
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
            <div className="relative">
              <CompanyDropdown showLabel={false} />
            </div>
          </div>

          <div className="relative" ref={userMenuRef}>
            <div className="flex items-center justify-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full bg-gray-300"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=3b82f6&color=fff`;
                }}
              />{' '}
              <div className="hidden text-left sm:block">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </div>
            </div>

            {showUserMenu && (
              <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-200 p-3">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setShowUserMenu(false);
                    }}
                    className="da flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => {
                      console.log('Logout clicked');
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
