import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { CancelButton, SubmitButton } from '../../Buttons';
import { Grid, GridCell } from '@/components/ui/grid';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, TextInputType } from '@/components/ui/text-input';
import { ImageUploader } from '@/components/ui/image-uploader/ImageUploader';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { CompanyService } from '@/services/company-services';
import { ICompany } from '@/types/company';
import { Loading } from '@/components/ui/Loading';
import { Form } from '@/components/ui/form';

const formSchema = z
  .object({
    name: z.string().min(1),
    companyId: z.string().min(1),
    serverUrl: z.string().url(),
    username: z.string().min(1),
    password: z.string().min(1),
    database: z.string().min(1),
    logoUrl: z.string().optional(),
    logoBase64: z.string().optional(),
  })
  .refine(
    data => {
      return data.logoBase64 || data.logoUrl;
    },
    {
      message: 'Company logo is required',
      path: ['logoBase64'],
    }
  );

type FormData = z.infer<typeof formSchema>;

type CompanyModalProps = {
  mode: 'edit' | 'create';
  company: ICompany | null;
  onSubmit: (company: any) => void;
  onCancel: () => void;
};

export const CreateCompany = (props: CompanyModalProps) => {
  const { mode, onSubmit, onCancel } = props;
  const isEditMode = mode === 'edit';
  const existingCompany = isEditMode ? props.company : null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEditMode ? existingCompany?.name || '' : '',
      companyId: isEditMode ? existingCompany?.companyId || '' : '',
      serverUrl: isEditMode ? existingCompany?.serverUrl || '' : '',
      username: isEditMode ? existingCompany?.username || '' : '',
      password: isEditMode ? existingCompany?.password || '' : '',
      database: isEditMode ? existingCompany?.database || '' : '',
      logoUrl: isEditMode ? existingCompany?.logoUrl || '' : '',
      logoBase64: '',
    },
  });

  const logoUrl = watch('logoUrl');
  const logoBase64 = watch('logoBase64');

  const currentLogoValue = logoBase64 || logoUrl || '';

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      if (isEditMode) {
        const updateData = {
          ...formData,
          ...(logoBase64 ? { logoBase64 } : {}),
          ...(logoBase64 ? { logoUrl: undefined } : {}),
        };
        return CompanyService.updateCompany(existingCompany!._id, updateData, signal);
      } else {
        const createData = {
          name: formData.name,
          companyId: formData.companyId,
          serverUrl: formData.serverUrl,
          username: formData.username,
          password: formData.password,
          database: formData.database,
          logoBase64: formData.logoBase64 || '',
        };
        return CompanyService.createCompany(createData, signal);
      }
    },
    {
      onSuccess: company => {
        console.log(`Company ${isEditMode ? 'updated' : 'created'} successfully:`, company);
        reset();
        onSubmit(company);
      },
      onError: error => {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} company:`, error);
      },
    }
  );

  const onFormSubmit = (formData: FormData) => {
    submit(formData);
  };

  const handleLogoChange = (value: string) => {
    console.log(value);

    if (!value) {
      setValue('logoUrl', '');
    }
    if (isEditMode) {
      setValue('logoBase64', value);
      if (value) {
        setValue('logoUrl', '');
      }
    } else {
      setValue('logoBase64', value);
    }
  };

  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>{isEditMode ? 'Edit Company' : 'Create Company'}</ModalHeader>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Loading isLoading={isSubmitting}>
          <ModalContent>
            <Grid className="gap-y-4.5">
              <GridCell>
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Name"
                      hasError={fieldState.invalid}
                      placeholder="Enter Company Name"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Company id"
                      hasError={fieldState.invalid}
                      placeholder="Enter Company Id"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>

              <GridCell>
                <Controller
                  name="serverUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="SAP URL"
                      hasError={fieldState.invalid}
                      placeholder="Enter SAP URL"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>

              <GridCell>
                <Controller
                  name="username"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Username"
                      hasError={fieldState.invalid}
                      placeholder="Enter Username"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>

              <GridCell>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      type={TextInputType.PASSWORD}
                      label="Password"
                      hasError={fieldState.invalid}
                      placeholder="Enter Password"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>

              <GridCell>
                <Controller
                  name="database"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label="Database"
                      hasError={fieldState.invalid}
                      placeholder="Enter Database"
                      className="w-full"
                      isRequired
                    />
                  )}
                />
              </GridCell>

              <GridCell size={Grid.CellSize.S6}>
                <ImageUploader
                  value={currentLogoValue}
                  onChange={handleLogoChange}
                  label="Company Logo"
                  placeholder={
                    isEditMode ? 'Upload new logo or keep existing' : 'Upload company logo'
                  }
                  className=""
                  disabled={false}
                  isRequired
                  error={errors.logoBase64?.message}
                />
              </GridCell>
            </Grid>
          </ModalContent>
        </Loading>
        <ModalFooter>
          <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} />
          <CancelButton onClick={onCancel} isDisabled={isSubmitting} />
        </ModalFooter>
      </Form>
    </Modal>
  );
};
