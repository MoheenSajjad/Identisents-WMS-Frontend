import { Icons } from '@/components/Icons';
import { Portal } from '@/components/parts/portal';
import React, { JSX } from 'react';

enum ModalSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
  XLARGE = 'xl',
  XXLARGE = 'xxl',
}

interface ModalProps {
  onClose?: () => void;
  Icon?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
}

type Modal = {
  (props: ModalProps): JSX.Element;
  Size: typeof ModalSize;
};

interface ModalHeaderProps {
  children?: React.ReactNode;
  onClose: () => void;
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

export const ModalHeader = ({ onClose, children }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between rounded-none border-b border-gray-200 bg-neutral-50 px-4 py-4">
      <h3 className="text-primary font-semibold" id="modal-title">
        {children && children}
      </h3>
      <div onClick={onClose}>
        <Icons.CircleX className="text-darker-grey cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-600" />
      </div>
    </div>
  );
};

export const ModalContent = ({ children, className }: ModalContentProps) => {
  return <div className={`mt-2 px-1 pt-3 pb-4 text-sm text-gray-500 ${className}`}>{children}</div>;
};

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="gap-2 rounded-none border-t-[1px] border-gray-200 bg-neutral-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6">
      {children}
    </div>
  );
};

export const Modal = ({ Icon, children, size = ModalSize.MEDIUM }: ModalProps) => {
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-4xl w-[50%]',
    lg: 'sm:max-w-screen-lg w-[70%]',
    xl: 'sm:max-w-screen-xl w-[85%]',
    xxl: 'w-full h-full max-w-none max-h-none', // Full screen
  };

  return (
    <Portal rootId="modals">
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-1000 ease-in-out"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 w-screen overflow-hidden">
          <div className="flex min-h-full items-center justify-center p-0 text-center sm:items-center sm:p-0">
            <div
              className={`transform rounded-none bg-white text-left shadow-xl transition-all ${sizeClasses[size]}`}
            >
              <div className="h-full rounded-none bg-white">
                <div className="h-full sm:flex sm:items-start">
                  {Icon && Icon}

                  <div className="mt-1 h-full w-full text-center sm:mt-0 sm:text-left">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

Modal.Size = ModalSize;
