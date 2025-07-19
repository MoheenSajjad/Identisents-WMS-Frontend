import React, { useState } from 'react';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton, CancelButton } from '@/components/parts/Buttons';
import { OpacityWrapper } from '@/components/parts/opacity-wrapper';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { JobAssignmentService } from '@/services/job-assignment-service';
import { Grid } from '@/components/ui/grid';
import { EmployeeDropdown } from '../../dropdowns/employee-dropdown';
import { TextFormField } from '@/components/ui/formField';
import EmployeeChangeConfirmationModal from '../employee-change-confirmation-modal/EmployeeChangeConfirmationModal';

interface IAssignJobModalProps {
  onCancel: () => void;
  onSubmit: () => void;
  jobId: string;
  currentEmployeeId: string | null;
}

const formSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  remarks: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const AssignJobModal: React.FC<IAssignJobModalProps> = ({
  onCancel,
  onSubmit,
  jobId,
  currentEmployeeId,
}) => {
  const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: currentEmployeeId || '',
      remarks: '',
    },
  });

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      return JobAssignmentService.assignJob({ data: formData, jobId }, signal);
    },
    {
      onSuccess: () => {
        reset();
        onSubmit();
      },
      onError: err => {
        console.error('Error assigning job:', err);
      },
    }
  );

  const handleFormSubmit = (data: FormData) => {
    // Check if employee has changed and job was already assigned
    const hasEmployeeChanged = currentEmployeeId && data.employeeId !== currentEmployeeId;
    
    if (hasEmployeeChanged) {
      // Show confirmation modal before submitting
      setPendingFormData(data);
      setShowChangeConfirmation(true);
    } else {
      // No change or new assignment, submit directly
      submit(data);
    }
  };

  const handleChangeConfirmation = () => {
    if (pendingFormData) {
      submit(pendingFormData);
    }
    setShowChangeConfirmation(false);
    setPendingFormData(null);
  };

  const handleCancelChange = () => {
    // Reset the form to original employee selection
    reset({
      employeeId: currentEmployeeId || '',
      remarks: '',
    });
    setShowChangeConfirmation(false);
    setPendingFormData(null);
  };

  return (
    <Modal size={Modal.Size.MEDIUM}>
      <ModalHeader onClose={onCancel}>Assign Job</ModalHeader>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent>
            <Grid className="space-y-4.5">
              <Grid.Cell size={Grid.CellSize.S12}>
                <Controller
                  name="employeeId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EmployeeDropdown
                      value={field.value}
                      onSelect={e => field.onChange(e._id)}
                      hasError={!!fieldState.error}
                      isRequired
                      className="w-full"
                    />
                  )}
                />
              </Grid.Cell>
              <Grid.Cell size={Grid.CellSize.S12}>
                <TextFormField
                  control={control}
                  name="remarks"
                  label="Remarks"
                  placeholder="remarks"
                  hasError={control.getFieldState('remarks').invalid}
                />
              </Grid.Cell>
            </Grid>
          </ModalContent>
        </OpacityWrapper>
        <ModalFooter>
          <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} label="Assign" />
          <CancelButton
            onClick={() => {
              reset();
              onCancel();
            }}
            isDisabled={isSubmitting}
          />
        </ModalFooter>
      </Form>
      
      {showChangeConfirmation && (
        <EmployeeChangeConfirmationModal
          open={showChangeConfirmation}
          onClose={handleCancelChange}
          onConfirm={handleChangeConfirmation}
        />
      )}
    </Modal>
  );
};

export default AssignJobModal;
