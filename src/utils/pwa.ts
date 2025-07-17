// PWA utilities and service worker registration

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallPrompt {
  prompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  showPrompt: () => Promise<boolean>;
}

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installPromptListeners: Array<(prompt: PWAInstallPrompt) => void> = [];

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallPromptListeners();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.notifyInstallPromptListeners();
    });
  }

  private notifyInstallPromptListeners() {
    const promptInfo: PWAInstallPrompt = {
      prompt: this.deferredPrompt,
      isInstallable: !!this.deferredPrompt,
      isInstalled: this.isInstalled(),
      showPrompt: () => this.showInstallPrompt()
    };

    this.installPromptListeners.forEach(listener => listener(promptInfo));
  }

  public onInstallPromptChange(callback: (prompt: PWAInstallPrompt) => void) {
    this.installPromptListeners.push(callback);
    // Immediately call with current state
    this.notifyInstallPromptListeners();
  }

  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        this.deferredPrompt = null;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }

  public isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      console.log('Service Worker registered successfully:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available; show update notification
              this.showUpdateNotification(registration);
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_READY') {
          this.showUpdateNotification(registration);
        }
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  private showUpdateNotification(registration: ServiceWorkerRegistration) {
    if (confirm('A new version of the app is available. Would you like to update?')) {
      const waitingWorker = registration.waiting;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  public showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.avif',
        badge: '/logo.avif',
        ...options
      });
    }
  }

  public getNetworkStatus(): boolean {
    return navigator.onLine;
  }

  public onNetworkStatusChange(callback: (isOnline: boolean) => void) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}

export const pwaService = new PWAService();

// Initialize PWA on app start
export const initializePWA = async () => {
  await pwaService.registerServiceWorker();
  await pwaService.requestNotificationPermission();
  
  // Log PWA status
  console.log('PWA initialized', {
    isInstalled: pwaService.isInstalled(),
    isOnline: pwaService.getNetworkStatus(),
    notificationPermission: Notification.permission
  });
};

// Utility functions
export const isPWAInstalled = () => pwaService.isInstalled();
export const isOnline = () => pwaService.getNetworkStatus();
export const showInstallPrompt = () => pwaService.showInstallPrompt();
export const onInstallPromptChange = (callback: (prompt: PWAInstallPrompt) => void) => 
  pwaService.onInstallPromptChange(callback);
export const onNetworkStatusChange = (callback: (isOnline: boolean) => void) => 
  pwaService.onNetworkStatusChange(callback);
export const showNotification = (title: string, options?: NotificationOptions) => 
  pwaService.showNotification(title, options);