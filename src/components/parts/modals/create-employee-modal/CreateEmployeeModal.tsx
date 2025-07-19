import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { CancelButton, SubmitButton } from '../../Buttons';
import { Grid, GridCell } from '@/components/ui/grid';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Form } from '@/components/ui/form';
import { OpacityWrapper } from '../../opacity-wrapper';
import { IEmployee, MOBILE_MODULES, PORTAL_MODULES } from '@/types/employee';
import { EmployeeService } from '@/services/employee-services';
import { PasswordFormField, TextFormField } from '@/components/ui/formField';
import { EmployeeAssignCompanyDropdown } from '../../dropdowns/employee-assign-companies-dropdown';
import { FormSwitch } from '@/components/ui/form-switch';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/Icons';

const mobilePermissionSchema = z.object({
  module: z.nativeEnum(MOBILE_MODULES),
  fullAccess: z.boolean(),
});

const portalPermissionSchema = z
  .object({
    module: z.nativeEnum(PORTAL_MODULES),
    isRead: z.boolean(),
    fullAccess: z.boolean(),
    noAccess: z.boolean(),
  })
  .refine(
    data => {
      const permissions = [data.isRead, data.fullAccess, data.noAccess];
      return permissions.filter(Boolean).length === 1;
    },
    {
      message: 'Exactly one of isRead, fullAccess, or noAccess must be true',
    }
  );

const permissionsSchema = z.object({
  mobilePermissions: z.array(mobilePermissionSchema),
  portalPermissions: z.array(portalPermissionSchema),
});

const formSchema = z
  .object({
    employeeCode: z.string().min(1),
    employeeName: z.string().min(1),
    userName: z.string().min(1),
    email: z.string().email(),
    mobilePhone: z.string().min(1),
    isMobileUser: z.boolean(),
    isPortalUser: z.boolean(),
    password: z.string().optional(),
    companies: z
      .array(
        z.object({
          id: z.string().min(1),
          isDefault: z.boolean(),
        })
      )
      .min(1, 'At least one company is required'),
    permissions: permissionsSchema,
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

const createDefaultMobilePermissions = () => {
  return Object.values(MOBILE_MODULES).map(module => ({
    module: module as MOBILE_MODULES,
    fullAccess: false,
  }));
};

const createDefaultPortalPermissions = () => {
  return Object.values(PORTAL_MODULES).map(module => ({
    module: module as PORTAL_MODULES,
    isRead: false,
    fullAccess: false,
    noAccess: true,
  }));
};

export const CreateEmployeeModal = ({
  mode,
  employee,
  onSubmit,
  onCancel,
}: CreateEmployeeProps) => {
  const [activeTab, setActiveTab] = useState<string>('general');

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
      userName: employee?.userName || '',
      email: employee?.email || '',
      mobilePhone: employee?.mobilePhone || '',
      isMobileUser: employee?.isMobileUser ?? true,
      isPortalUser: employee?.isPortalUser ?? false,
      companies:
        employee?.companies?.map(c => ({
          id: c.id,
          isDefault: c.isDefault,
        })) || [],
      permissions: {
        mobilePermissions: employee?.permissions?.mobilePermissions
          ? employee?.permissions?.mobilePermissions
          : createDefaultMobilePermissions(),
        portalPermissions: employee?.permissions?.portalPermissions
          ? employee?.permissions?.portalPermissions
          : createDefaultPortalPermissions(),
      },
    },
  });

  console.log(errors);

  const isMobileUser = useWatch({ control, name: 'isMobileUser' });
  const isPortalUser = useWatch({ control, name: 'isPortalUser' });

  useEffect(() => {
    if (isPortalUser) {
      const currentPortalPermissions = getValues('permissions.portalPermissions');
      if (!currentPortalPermissions || currentPortalPermissions.length === 0) {
        setValue('permissions.portalPermissions', createDefaultPortalPermissions());
      }
    } else {
      setValue('permissions.portalPermissions', []);
    }
  }, [isPortalUser, setValue, getValues]);

  useEffect(() => {
    if (isMobileUser) {
      const currentMobilePermissions = getValues('permissions.mobilePermissions');
      if (!currentMobilePermissions || currentMobilePermissions.length === 0) {
        setValue('permissions.mobilePermissions', createDefaultMobilePermissions());
      }
    } else {
      setValue('permissions.mobilePermissions', []);
    }
  }, [isMobileUser, setValue, getValues]);

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

  const handleMobilePermissionToggle = (moduleIndex: number) => {
    const currentPermissions = getValues('permissions.mobilePermissions');
    const updatedPermissions = [...currentPermissions];

    updatedPermissions[moduleIndex] = {
      ...updatedPermissions[moduleIndex],
      fullAccess: !updatedPermissions[moduleIndex].fullAccess,
    };

    setValue('permissions.mobilePermissions', updatedPermissions);
  };

  const handlePortalPermissionToggle = (
    moduleIndex: number,
    permissionType: 'isRead' | 'fullAccess' | 'noAccess'
  ) => {
    const currentPermissions = getValues('permissions.portalPermissions');
    const updatedPermissions = [...currentPermissions];

    updatedPermissions[moduleIndex] = {
      ...updatedPermissions[moduleIndex],
      isRead: false,
      fullAccess: false,
      noAccess: false,
    };

    updatedPermissions[moduleIndex][permissionType] = true;

    setValue('permissions.portalPermissions', updatedPermissions);
  };

  return (
    <Modal size={Modal.Size.XLARGE}>
      <ModalHeader onClose={onCancel}>
        {isEditMode ? 'Edit Employee' : 'Create Employee'}
      </ModalHeader>
      <Form onSubmit={handleSubmit(submit)}>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent className="!mt-0 min-h-96">
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="portalPermissions" disabled={!isPortalUser}>
                  Portal Permissions
                </TabsTrigger>
                <TabsTrigger value="mobilePermissions" disabled={!isMobileUser}>
                  Mobile Permissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
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
                      name="userName"
                      label="User Name"
                      placeholder="user name"
                      hasError={control.getFieldState('userName').invalid}
                      error={errors.userName}
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
              </TabsContent>

              <TabsContent value="portalPermissions">
                <Controller
                  name="permissions.portalPermissions"
                  control={control}
                  render={({ field: { value } }) => (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="p-3">Module</TableHead>
                          <TableHead className="text-center">Read</TableHead>
                          <TableHead className="text-center">Full Access</TableHead>
                          <TableHead className="text-center">No Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {value &&
                          value.map((permission, index) => (
                            <TableRow key={permission.module}>
                              <TableData>{permission.module}</TableData>
                              <TableData className="text-center">
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={permission.isRead}
                                    onChange={() => handlePortalPermissionToggle(index, 'isRead')}
                                    onIcon={<Icons.CheckCheck />}
                                    offIcon={<Icons.CircleX />}
                                  />
                                </div>
                              </TableData>
                              <TableData className="text-center">
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={permission.fullAccess}
                                    onChange={() =>
                                      handlePortalPermissionToggle(index, 'fullAccess')
                                    }
                                    onIcon={<Icons.CheckCheck />}
                                    offIcon={<Icons.CircleX />}
                                  />
                                </div>
                              </TableData>
                              <TableData className="text-center">
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={permission.noAccess}
                                    onChange={() => handlePortalPermissionToggle(index, 'noAccess')}
                                    onIcon={<Icons.CheckCheck />}
                                    offIcon={<Icons.CircleX />}
                                  />
                                </div>
                              </TableData>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                />
              </TabsContent>

              <TabsContent value="mobilePermissions">
                <Controller
                  name="permissions.mobilePermissions"
                  control={control}
                  render={({ field: { value } }) => (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="p-3">Module</TableHead>
                          <TableHead className="text-center">No Access / Full Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {value &&
                          value.map((permission, index) => (
                            <TableRow key={permission.module}>
                              <TableData>{permission.module}</TableData>
                              <TableData className="text-center">
                                <div className="flex items-center justify-center">
                                  <Switch
                                    checked={permission.fullAccess}
                                    onChange={() => handleMobilePermissionToggle(index)}
                                    onIcon={<Icons.CheckCheck />}
                                    offIcon={<Icons.CircleX />}
                                  />
                                </div>
                              </TableData>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                />
              </TabsContent>
            </Tabs>
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
