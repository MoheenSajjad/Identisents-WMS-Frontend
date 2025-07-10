import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Package, Users2Icon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import logo from '@/assets/logo.avif';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  children?: NavItem[];
  isNew?: boolean;
  isComingSoon?: boolean;
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  onItemClick: (item: NavItem) => void;
}

const sidebarVariants = {
  open: {
    width: '12rem',
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  closed: {
    width: '0rem',
    opacity: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const navItemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
  closed: {
    opacity: 0,
    x: -20,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const logoVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
      delay: 0.1,
    },
  },
  closed: {
    opacity: 0,
    scale: 0.8,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onItemClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    onItemClick(item);
  };

  const itemClasses = cn(
    'flex items-center gap-3 px-3 py-2 transition-all duration-200 group',
    'hover:bg-gray-100 text-gray-600',
    isActive && 'bg-blue-400 text-black border-l-4 border-gray-800 rounded-tl rounded-bl'
  );

  const iconClasses = cn(
    'text-xl transition-colors',
    isActive && 'text-white bg-transparent text-black',
    !isActive && 'text-gray-500 group-hover:text-gray-700 bg-transparent'
  );

  const content = (
    <>
      <motion.span className={iconClasses} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <item.icon size={16} />
      </motion.span>
      <span className="flex-1 text-xs font-semibold">{item.label}</span>
    </>
  );

  return (
    <motion.li variants={navItemVariants}>
      {item.path ? (
        <NavLink
          to={item.path}
          className={({ isActive: linkActive }) =>
            cn(itemClasses, linkActive && 'bg-gray-100 drop-shadow-xs')
          }
          onClick={handleClick}
        >
          <motion.div
            className="flex w-full items-center gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
          >
            {content}
          </motion.div>
        </NavLink>
      ) : (
        <button
          className={cn(itemClasses, 'w-full text-left')}
          onClick={handleClick}
          disabled={item.isComingSoon}
        >
          <motion.div
            className="flex w-full items-center gap-3"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
          >
            {content}
          </motion.div>
        </button>
      )}
    </motion.li>
  );
};

const NavItemComponent: React.FC<
  Omit<NavItemProps, 'isActive' | 'hasActiveChild'> & {
    onItemClick: (item: NavItem) => void;
  }
> = ({ item, onItemClick }) => {
  const location = useLocation();
  const isActive = item.path === location.pathname;

  return <NavItem item={item} isActive={isActive} onItemClick={onItemClick} />;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/api/placeholder/32/32',
    role: 'Administrator',
  });

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: Building2,
      path: '/companies',
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users2Icon,
      path: '/employees',
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: Package,
      path: '/warehouses',
    },
    {
      id: 'binSubLevel',
      label: 'Bin Sub Levels',
      icon: Package,
      path: '/bin-sub-levels',
    },
    {
      id: 'binLocations',
      label: 'Bin Locations',
      icon: Package,
      path: '/bin-locations',
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Package,
      path: '/jobs',
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (isMobile && item.path) {
      onClose();
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key="sidebar"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={cn(
          'flex h-full flex-col overflow-hidden bg-white shadow-2xl shadow-[#adb5bd]',
          isMobile && 'fixed inset-y-0 left-0 z-30'
        )}
      >
        <motion.div className="flex items-center justify-between pt-4" variants={logoVariants}>
          <div className="flex w-full items-start justify-start px-2">
            <motion.img
              src={logo}
              className="w-[110px] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </div>
        </motion.div>

        <motion.nav className="mt-2 flex-1 overflow-hidden py-4" variants={navItemVariants}>
          <motion.ul className="space-y-3 px-3 text-red-400" variants={navItemVariants}>
            {navigationItems.map((item, index) => (
              <NavItemComponent key={item.id} item={item} onItemClick={handleItemClick} />
            ))}
          </motion.ul>
        </motion.nav>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, type: 'spring' as const, stiffness: 300, damping: 24 }}
            className="border-t border-gray-200 p-3"
          >
            <motion.div
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                <p className="truncate text-xs text-gray-500">{user.role}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
