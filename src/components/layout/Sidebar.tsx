import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Package } from "lucide-react";
import { cn } from "@/utils/helpers";
import logo from "@/assets/logo.avif";

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
  badge?: string | number;
  children?: NavItem[];
  isNew?: boolean;
  isComingSoon?: boolean;
}

interface NavItemProps {
  item: NavItem;
  level?: number;
  isActive: boolean;

  onItemClick: (item: NavItem) => void;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  level = 0,
  isActive,

  onItemClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    onItemClick(item);
  };

  const itemClasses = cn(
    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group",
    "hover:bg-gray-100  text-gray-600"
  );

  const iconClasses = cn(
    "text-xl transition-colors  p-[6px] rounded-lg",
    isActive && "text-white bg-blue-400",
    !isActive && "text-gray-500  group-hover:text-gray-700 bg-white"
  );

  const content = (
    <>
      <span className={iconClasses}>
        <item.icon size={18} />
      </span>
      <span className="text-sm font-medium flex-1">{item.label}</span>
    </>
  );

  return (
    <li>
      {item.path ? (
        <NavLink
          to={item.path}
          className={({ isActive: linkActive }) =>
            cn(itemClasses, linkActive && "bg-white/80 drop-shadow-xs ")
          }
          onClick={handleClick}
        >
          {content}
        </NavLink>
      ) : (
        <button
          className={cn(itemClasses, "w-full text-left")}
          onClick={handleClick}
          disabled={item.isComingSoon}
        >
          {content}
        </button>
      )}
    </li>
  );
};

const NavItemComponent: React.FC<
  Omit<NavItemProps, "isActive" | "hasActiveChild"> & {
    onItemClick: (item: NavItem) => void;
  }
> = ({ item, level = 0, onItemClick }) => {
  const location = useLocation();

  const isActive = item.path === location.pathname;

  return (
    <NavItem
      item={item}
      level={level}
      isActive={isActive}
      onItemClick={onItemClick}
    />
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "/api/placeholder/32/32",
    role: "Administrator",
  });

  const navigationItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "companies",
      label: "Companies",
      icon: Building2,
      path: "/companies",
      badge: 12,
    },

    {
      id: "warehouses",
      label: "Warehouses",
      icon: Package,
      path: "/warehouses",
    },
  ];

  const handleItemClick = (item: NavItem) => {
    if (isMobile && item.path) {
      onClose();
    }
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <aside
      className={cn(
        " transition-all duration-300 ease-in-out h-full shadow-xl flex flex-col",
        " ",
        isOpen ? "w-56 px-3" : "w-0",
        isMobile && "fixed inset-y-0 left-0 z-30",
        !isMobile && !isOpen && "overflow-hidden"
      )}
    >
      <div className="flex items-center justify-between pt-4 ">
        <div className="flex items-center justify-center w-full">
          <img src={logo} />
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              onItemClick={handleItemClick}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
