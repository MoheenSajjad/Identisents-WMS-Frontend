import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';
import { onInstallPromptChange, PWAInstallPrompt as PWAInstallPromptType } from '@/utils/pwa';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPromptType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Listen for install prompt changes
    onInstallPromptChange((prompt) => {
      setInstallPrompt(prompt);
      
      // Show prompt if installable and not dismissed
      if (prompt.isInstallable && !prompt.isInstalled && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => {
      // No cleanup needed as onInstallPromptChange doesn't return unsubscribe
    };
  }, [isDismissed]);

  const handleInstall = async () => {
    if (installPrompt) {
      const success = await installPrompt.showPrompt();
      if (success) {
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };


  if (!isVisible || !installPrompt?.isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm ${className}`}
      >
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <Icons.Plus className="w-4 h-4 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">Install App</h3>
                <p className="text-xs text-gray-500">
                  Install Identiscents WMS
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                variant={Button.Variant.PRIMARY}
                size={Button.Size.SMALL}
                className="text-xs px-3 py-1"
              >
                Install
              </Button>
              
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Close install prompt"
              >
                <Icons.CircleX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Alternative compact banner style
export const PWAInstallBanner: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPromptType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    onInstallPromptChange((prompt) => {
      setInstallPrompt(prompt);
      
      if (prompt.isInstallable && !prompt.isInstalled && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => {
      // No cleanup needed
    };
  }, [isDismissed]);

  const handleInstall = async () => {
    if (installPrompt) {
      const success = await installPrompt.showPrompt();
      if (success) {
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-banner-dismissed', 'true');
  };

  if (!isVisible || !installPrompt?.isInstallable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      >
        <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Icons.Plus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Install Identiscents WMS</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                variant={Button.Variant.PRIMARY}
                size={Button.Size.SMALL}
                className="text-xs px-3 py-1"
              >
                Install
              </Button>
              
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Close install banner"
              >
                <Icons.CircleX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// iOS-style install prompt
export const PWAInstallPromptIOS: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIOS && !isInStandaloneMode) {
      const dismissed = localStorage.getItem('pwa-install-ios-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-ios-dismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      >
        <div className="bg-black/50 fixed inset-0" onClick={handleDismiss} />
        
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full relative">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Plus className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Install Identiscents WMS
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              To install this app on your iPhone, tap the Share button and then "Add to Home Screen"
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
              <span>1. Tap</span>
              <Icons.ChevronUpDown className="w-4 h-4" />
              <span>2. Select "Add to Home Screen"</span>
            </div>
            
            <Button
              onClick={handleDismiss}
              variant={Button.Variant.PRIMARY}
              size={Button.Size.DEFAULT}
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};