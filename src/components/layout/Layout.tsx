import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNotification } from "@/context/NotificationContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Toast } from "../ui/Toast";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.innerWidth >= 1024;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { notifications, removeNotification } = useNotification();

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOverlayClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]  transition-colors">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1  overflow-auto h-full ">
          <div className=" max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            action={notification.action}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};
