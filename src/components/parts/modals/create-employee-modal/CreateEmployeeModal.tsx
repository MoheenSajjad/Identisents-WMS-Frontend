import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { CancelButton, SubmitButton } from '../../Buttons';
import { Grid, GridCell } from '@/components/ui/grid';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Form } from '@/components/ui/form';
import { OpacityWrapper } from '../../opacity-wrapper';
import { IEmployee } from '@/types/employee';
import { EmployeeService } from '@/services/employee-services';
import { PasswordFormField, TextFormField } from '@/components/ui/formField';
import { EmployeeAssignCompanyDropdown } from '../../dropdowns/employee-assign-companies-dropdown';
import { FormSwitch } from '@/components/ui/form-switch';
import { useEffect } from 'react';

const formSchema = z
  .object({
    employeeCode: z.string().min(1),
    employeeName: z.string().min(1),
    email: z.string().email(),
    mobilePhone: z.string().min(1),
    isMobileUser: z.boolean(),
    isPortalUser: z.boolean(),
    password: z.string().min(6).optional(),
    companies: z
      .array(
        z.object({
          id: z.string().min(1),
          isDefault: z.boolean(),
        })
      )
      .min(1, 'At least one company is required'),
  })
  .refine(data => data.companies.some(c => c.isDefault === true), {
    path: ['companies'],
    message: 'At least one company must be marked as default',
  });

type FormData = z.infer<typeof formSchema>;

interface CreateEmployeeProps {
  mode: 'edit' | 'create';
  employee: IEmployee | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateEmployeeModal = ({
  mode,
  employee,
  onSubmit,
  onCancel,
}: CreateEmployeeProps) => {
  const isEditMode = mode === 'edit';

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeCode: employee?.employeeCode || '',
      employeeName: employee?.employeeName || '',
      email: employee?.email || '',
      mobilePhone: employee?.mobilePhone || '',
      isMobileUser: employee?.isMobileUser ?? true,
      isPortalUser: employee?.isPortalUser ?? false,
      companies:
        employee?.companies?.map(c => ({
          id: c.id,
          isDefault: c.isDefault,
        })) || [],
    },
  });

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      if (isEditMode && employee) {
        return EmployeeService.update(employee._id, formData, signal);
      }
      return EmployeeService.create(formData, signal);
    },
    {
      onSuccess: () => {
        reset();
        onSubmit();
      },
      onError: err => console.error(err),
    }
  );

  console.log(errors, getValues());

  const isMobileUser = useWatch({ control, name: 'isMobileUser' });
  const isPortalUser = useWatch({ control, name: 'isPortalUser' });

  useEffect(() => {
    if (isMobileUser && isPortalUser) {
      setValue('isPortalUser', false);
    }
  }, [isMobileUser]);

  useEffect(() => {
    if (isPortalUser && isMobileUser) {
      setValue('isMobileUser', false);
    }
  }, [isPortalUser]);
  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>
        {isEditMode ? 'Edit Employee' : 'Create Employee'}
      </ModalHeader>
      <Form onSubmit={handleSubmit(data => submit(data))}>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent>
            <Grid className="gap-y-4.5">
              <GridCell>
                <TextFormField
                  control={control}
                  name="employeeCode"
                  label="Employee Code"
                  placeholder="employee code"
                  isDisabled={isEditMode}
                  hasError={control.getFieldState('employeeCode').invalid}
                  isRequired
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  control={control}
                  name="employeeName"
                  label="Employee Name"
                  placeholder="employee name"
                  hasError={control.getFieldState('employeeName').invalid}
                  isRequired
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  control={control}
                  name="mobilePhone"
                  label="Phone Number"
                  placeholder="phone number"
                  hasError={control.getFieldState('mobilePhone').invalid}
                  isRequired
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="companies"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EmployeeAssignCompanyDropdown
                      className="w-full"
                      value={field.value}
                      onChange={sub => field.onChange(sub)}
                      hasError={!!fieldState.error}
                      isRequired
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="email"
                  hasError={control.getFieldState('email').invalid}
                  isRequired
                />
              </GridCell>
              <GridCell>
                <PasswordFormField
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="password"
                  hasError={control.getFieldState('password').invalid}
                  isRequired={!isEditMode}
                />
              </GridCell>
              <GridCell size={Grid.CellSize.S4} className="flex-grow-0">
                <Controller
                  name="isMobileUser"
                  control={control}
                  render={({}) => (
                    <FormSwitch label="Mobile User" name="isMobileUser" control={control} />
                  )}
                />
              </GridCell>

              <GridCell size={Grid.CellSize.S4} className="flex-grow-0">
                <Controller
                  name="isPortalUser"
                  control={control}
                  render={({}) => (
                    <FormSwitch label="Portal User" name="isPortalUser" control={control} />
                  )}
                />
              </GridCell>
            </Grid>
          </ModalContent>
        </OpacityWrapper>
        <ModalFooter>
          <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} />
          <CancelButton
            isDisabled={isSubmitting}
            onClick={() => {
              reset();
              onCancel();
            }}
          />
        </ModalFooter>
      </Form>
    </Modal>
  );
};
