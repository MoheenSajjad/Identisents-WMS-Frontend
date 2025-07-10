import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { Portal } from '../portal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isLoading: boolean;
  isRestore: boolean;
  deleteHeader?: string;
  deleteMessage?: string;
  restoreHeader?: string;
  restoreMessage?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onDelete,
  isLoading,
  isRestore = false,
  deleteHeader = 'Delete Record',
  deleteMessage = 'You’re going to delete this record. Are you sure?',
  restoreHeader = 'Restore Record',
  restoreMessage = 'You’re going to restore this record. Are you sure?',
}) => {
  if (!open) return null;

  const header = isRestore ? restoreHeader : deleteHeader;
  const message = isRestore ? restoreMessage : deleteMessage;
  const iconColor = isRestore ? 'text-green-500' : 'text-red-500';
  const iconBg = isRestore ? 'bg-green-100' : 'bg-red-100';
  const buttonVariant = isRestore ? Button.Variant.PRIMARY : Button.Variant.DESTRUCTIVE;
  const buttonText = isLoading
    ? isRestore
      ? 'Restoring...'
      : 'Deleting...'
    : isRestore
      ? 'Yes, Restore It!'
      : 'Yes, Delete It!';

  return (
    <Portal rootId="modals">
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-1000 ease-in-out"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="w-[350px] rounded-xl bg-white p-6 text-center shadow-xl">
              <div className="mb-4 flex justify-center">
                <div className={`rounded-full p-2 ${iconBg}`}>
                  <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
                </div>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-gray-800">{header}</h2>
              <p className="mb-6 text-sm text-gray-600">{message}</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={Button.Variant.SECONDARY}
                  onClick={onClose}
                  className="!rounded-full"
                >
                  {isRestore ? 'No, Don’t Restore.' : 'No, Keep It.'}
                </Button>
                <Button
                  variant={buttonVariant}
                  onClick={onDelete}
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

export default DeleteConfirmationModal;
