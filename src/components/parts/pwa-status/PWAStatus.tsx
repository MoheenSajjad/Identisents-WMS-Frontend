import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/components/Icons';
import { onNetworkStatusChange, isOnline as checkOnlineStatus } from '@/utils/pwa';

interface PWAStatusProps {
  className?: string;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(checkOnlineStatus());
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleNetworkChange = (online: boolean) => {
      setIsOnline(online);
      setShowStatus(true);
      
      // Hide status after 3 seconds
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    };

    onNetworkStatusChange(handleNetworkChange);
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-4 right-4 z-50 ${className}`}
        >
          <div className={`rounded-lg px-4 py-2 shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
            isOnline ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {isOnline ? (
              <>
                <Icons.CheckCircle className="w-4 h-4" />
                <span>Back online</span>
              </>
            ) : (
              <>
                <Icons.CircleX className="w-4 h-4" />
                <span>You're offline</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Network status badge for navbar
export const NetworkStatusBadge: React.FC<PWAStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(checkOnlineStatus());

  useEffect(() => {
    onNetworkStatusChange(setIsOnline);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-xs text-gray-600">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

// Update notification
export const PWAUpdateNotification: React.FC<PWAStatusProps> = ({ className }) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  // Don't show update notification on mobile app
  if (isMobile || window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-4 left-4 right-4 z-50 mx-auto max-w-md ${className}`}
        >
          <div className="bg-blue-600 text-white rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                <Icons.CheckCircle className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium mb-1">Update Available</h4>
                <p className="text-sm text-blue-100 mb-3">
                  A new version of the app is ready to install.
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Update Now
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="text-blue-100 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                aria-label="Close update notification"
              >
                <Icons.CircleX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};