import React from 'react';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton, CancelButton } from '@/components/parts/Buttons';
import { OpacityWrapper } from '@/components/parts/opacity-wrapper';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { JobAssignmentService } from '@/services/job-assignment-service';
import { IJobAssignment } from '@/types/job-assignment';
import { Grid } from '@/components/ui/grid';
import { EmployeeDropdown } from '../../dropdowns/employee-dropdown';
import { TextFormField } from '@/components/ui/formField';

interface IAssignJobModalProps {
  onCancel: () => void;
  onSubmit: (data: IJobAssignment) => void;
}

const formSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  remarks: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const AssignJobModal: React.FC<IAssignJobModalProps> = ({ onCancel, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: '',
      remarks: '',
    },
  });

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      return JobAssignmentService.assignJob(formData.employeeId, signal);
    },
    {
      onSuccess: res => {
        reset();
        // onSubmit(res.data);
      },
      onError: err => {
        console.error('Error assigning job:', err);
      },
    }
  );

  const handleFormSubmit = (data: FormData) => {
    submit(data);
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
          <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} />
          <CancelButton
            onClick={() => {
              reset();
              onCancel();
            }}
            isDisabled={isSubmitting}
          />
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AssignJobModal;
