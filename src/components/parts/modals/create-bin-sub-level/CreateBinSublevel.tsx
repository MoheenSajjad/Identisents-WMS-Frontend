import { Form } from '@/components/ui/form';
import { Grid, GridCell } from '@/components/ui/grid';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import {
  AddIconButton,
  CancelButton,
  DeleteIconButton,
  HeaderButton,
  SubmitButton,
} from '../../Buttons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormSwitch } from '@/components/ui/form-switch';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableData,
} from '@/components/ui/Table';
import { TextFormField } from '@/components/ui/formField';
import { IBinSubLevels } from '@/types/bin-sub-levels';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { BinSubLevelService } from '@/services/bin-sub-level-services';
import { OpacityWrapper } from '../../opacity-wrapper';

interface ICreateBinSubLevelModalProps {
  onCancel: () => void;
  onSubmit: (data: IBinSubLevels) => void;
  mode: 'create' | 'edit';
  binSubLevel: IBinSubLevels | null;
}

const formSchema = z.object({
  name: z.string().min(1, 'Sub level is required'),
  level: z.number(),
  isActive: z.boolean(),
  rows: z
    .array(
      z.object({
        code: z.string().min(1, 'Code is required'),
        name: z.string().min(1, 'Name is required'),
      })
    )
    .min(1, 'At least one bin is required'),
});

type FormData = z.infer<typeof formSchema>;

export const CreateBinSubLevel: React.FC<ICreateBinSubLevelModalProps> = ({
  onCancel,
  onSubmit,
  mode,
  binSubLevel,
}) => {
  const isEditMode = mode === 'edit';

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: binSubLevel?.level,
      name: binSubLevel?.name || '',
      isActive: binSubLevel?.isActive ?? true,
      rows: binSubLevel?.rows ?? [{ code: '', name: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  });

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) =>
      BinSubLevelService.updateBinSubLevel(binSubLevel!._id, formData, signal),

    {
      onSuccess: warehouse => {
        reset();
        onSubmit(warehouse.data);
      },
      onError: error => {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} warehouse:`, error);
      },
    }
  );

  const handleFormSubmit = (data: FormData) => {
    submit(data);
  };

  console.log(errors);

  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>Edit Bin Sub Level {getValues('level')}</ModalHeader>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent>
            <Grid className="gap-y-4.5">
              <GridCell>
                <TextFormField name="name" control={control} label="Name" isRequired />
              </GridCell>
              <GridCell>
                <FormSwitch label="Active" name="isActive" control={control} />
              </GridCell>
            </Grid>

            <div className="mt-6">
              <Table className="rounded-md border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <HeaderButton label="Code" showSortIcon={false} />
                    </TableHead>
                    <TableHead>
                      <HeaderButton label="Name" showSortIcon={false} />
                    </TableHead>
                    <TableHead className="text-center">
                      <HeaderButton label="Actions" showSortIcon={false} />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableData>
                        <TextFormField
                          name={`rows.${index}.code`}
                          control={control}
                          placeholder="code"
                        />
                      </TableData>
                      <TableData>
                        <TextFormField
                          name={`rows.${index}.name`}
                          control={control}
                          placeholder="name"
                        />
                      </TableData>
                      <TableData className="text-center">
                        <div className="">
                          <AddIconButton onClick={() => append({ code: '', name: '' })} />
                          {fields.length > 1 && <DeleteIconButton onClick={() => remove(index)} />}
                        </div>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
