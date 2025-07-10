import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { CancelButton, SubmitButton } from '../../Buttons';
import { Grid, GridCell } from '@/components/ui/grid';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Form } from '@/components/ui/form';
import { OpacityWrapper } from '../../opacity-wrapper';
import { IEmployee } from '@/types/employee';
import { EmployeeService } from '@/services/employee-services';
import { PasswordFormField, TextFormField } from '@/components/ui/formField';
import { EmployeeAssignCompanyDropdown } from '../../dropdowns/employee-assign-companies-dropdown';

const formSchema = z
  .object({
    employeeCode: z.string().min(1),
    employeeName: z.string().min(1),
    email: z.string().email(),
    mobilePhone: z.string().min(1),
    isMobileUser: z.boolean(),
    isPortalUser: z.boolean(),
    password: z.string().min(6),
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
  onSubmit: (employee: IEmployee) => void;
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
      isMobileUser: employee?.isMobileUser || false,
      isPortalUser: employee?.isPortalUser || false,

      password: employee?.password,
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
      onSuccess: created => {
        // reset();
        // onSubmit(created);
      },
      onError: err => console.error(err),
    }
  );

  console.log(errors, getValues());

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
                  isRequired
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
