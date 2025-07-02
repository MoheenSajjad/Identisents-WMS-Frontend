import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { CancelButton, SubmitButton } from '../../Buttons';
import { Grid, GridCell } from '@/components/ui/grid';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput } from '@/components/ui/text-input';
import { ImageUploader } from '@/components/ui/image-uploader/ImageUploader';

const formSchema = z.object({
  name: z.string(),
  serverUrl: z.string().url(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  imageUrl: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateCompany = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      serverUrl: '',
      username: '',
      password: '',
      database: '',
      imageUrl: '',
    },
  });

  const onformSubmit = (data: FormData) => {
    console.log('Form data:', data);
    onSubmit();
  };

  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>Create Company</ModalHeader>
      <form onSubmit={handleSubmit(onformSubmit)}>
        <ModalContent>
          <Grid className="gap-y-4.5">
            <GridCell>
              <Controller
                name="name"
                control={control}
                disabled
                render={({ field, fieldState }) => (
                  <TextInput
                    {...field}
                    label="Name"
                    hasError={true}
                    placeholder="Enter Company Name"
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
                disabled
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="SAP Url"
                    placeholder="Enter SAP Url"
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
                disabled
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="Username"
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
                disabled
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="Password"
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
                disabled
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="Database"
                    placeholder="Enter Database"
                    className="w-full"
                    isRequired
                  />
                )}
              />
            </GridCell>

            <GridCell size={Grid.CellSize.S6}>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    label="Company Logo"
                    placeholder="Upload company logo"
                    className=""
                    disabled={false}
                    isRequired
                    error={errors.imageUrl?.message}
                  />
                )}
              />
            </GridCell>
          </Grid>
        </ModalContent>
        <ModalFooter>
          <SubmitButton />
          <CancelButton onClick={onCancel} />
        </ModalFooter>
      </form>
    </Modal>
  );
};
