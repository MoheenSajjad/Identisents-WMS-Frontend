import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Settings, LogOut, Command } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { IconButton } from '../ui/icon-button';
import { Button } from '../ui/Button';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
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

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchFocused(true);
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <header className="shadow-2xs transition-colors">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Button
            icon={<Menu size={18} />}
            variant={Button.Variant.GHOST}
            onClick={onMenuClick}
            roundness={Button.Roundness.FULL}
            size={Button.Size.ICON}
            className="p-2"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          />

          <div className="flex items-center space-x-1 text-sm text-gray-600 md:space-x-2">
            <span className="text-gray-400">Pages</span>
            <span className="text-gray-400">/</span>
            <span className="cursor-pointer font-semibold text-gray-700">{getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                id="global-search"
                type="search"
                onFocus={() => setSearchFocused(true)}
                className={cn(
                  'border border-gray-300 bg-gray-50',
                  'rounded-lg py-2 pr-12 pl-10 text-sm text-gray-900',
                  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none',
                  'transition-all duration-200',
                  searchFocused ? 'w-80' : 'w-64'
                )}
                placeholder="Search companies, employees..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="hidden items-center rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500 sm:inline-flex">
                  <Command size={12} className="mr-1" />K
                </kbd>
              </div>
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
