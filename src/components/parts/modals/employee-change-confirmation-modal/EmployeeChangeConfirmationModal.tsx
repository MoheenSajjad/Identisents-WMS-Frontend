import { UserCheck } from 'lucide-react';
import React from 'react';
import { Portal } from '../../portal';
import { Button } from '@/components/ui/Button';

interface EmployeeChangeConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  header?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loadingText?: string;
}

const EmployeeChangeConfirmationModal: React.FC<EmployeeChangeConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  header = 'Change Employee Assignment',
  message = 'This job is already assigned to an employee. Are you sure you want to change the assignment?',
  confirmButtonText = 'Yes, Change Assignment',
  cancelButtonText = 'No, Keep Current Assignment',
  loadingText = 'Processing...',
}) => {
  if (!open) return null;

  const buttonText = isLoading ? loadingText : confirmButtonText;

  return (
    <Portal rootId="modals">
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-1000 ease-in-out"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="w-[450px] rounded-xl bg-white p-6 text-center shadow-xl">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-100 p-2">
                  <UserCheck className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-800">{header}</h2>
              <p className="mb-6 text-sm text-gray-600">{message}</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={Button.Variant.SECONDARY}
                  onClick={onClose}
                  className="!rounded-full"
                  disabled={isLoading}
                >
                  {cancelButtonText}
                </Button>
                <Button
                  variant={Button.Variant.PRIMARY}
                  onClick={onConfirm}
                  className="!rounded-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default EmployeeChangeConfirmationModal;
