import { Modal, ModalHeader } from '@/components/ui/modal';
import { IWarehouse } from '@/types/warehouse';
import React from 'react';

interface ICompanyModalProps {
  mode: 'edit' | 'create';
  company: IWarehouse | null;
  onSubmit: (company: any) => void;
  onCancel: () => void;
}

export const CreateWarehouse = (props: ICompanyModalProps) => {
  const { onCancel, onSubmit, mode } = props;
  const isEditMode = mode === 'edit';

  return (
    <Modal>
      <ModalHeader onClose={onCancel}>
        {isEditMode ? 'Edit Warehouse' : 'Create Warehouse'}
      </ModalHeader>
    </Modal>
  );
};
