import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/ui/formField';
import { Grid, GridCell } from '@/components/ui/grid';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { IWarehouse } from '@/types/warehouse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CancelButton, SubmitButton } from '../../Buttons';
import { FormSwitch } from '@/components/ui/form-switch';
import { SapWarehousesDropdown } from '../../dropdowns/sap-warehouses-dropdown';
import { CompanyDropdown } from '../../dropdowns/company-dropdown';
import { WarehouseService } from '@/services/warehouse-services';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { OpacityWrapper } from '../../opacity-wrapper';

interface ICreateWarehouseModalProps {
  mode: 'edit' | 'create';
  warehouse: IWarehouse | null;
  onSubmit: (warehouse: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  companyId: z.string().min(1),
  sapWarehouses: z.array(z.string()).min(1),
  isBinLocationEnabled: z.boolean(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateWarehouse = (props: ICreateWarehouseModalProps) => {
  const { onCancel, onSubmit, mode } = props;
  const isEditMode = mode === 'edit';

  const existingWarehouse = isEditMode ? props.warehouse : null;

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: isEditMode ? existingWarehouse?.code || '' : '',
      name: isEditMode ? existingWarehouse?.name || '' : '',
      companyId: isEditMode ? existingWarehouse?.companyId || '' : '',
      sapWarehouses: isEditMode ? existingWarehouse?.sapWarehouses || [] : [],
      isBinLocationEnabled: isEditMode ? (existingWarehouse?.isBinLocationEnabled ?? true) : true,
      isActive: isEditMode ? (existingWarehouse?.isActive ?? true) : true,
    },
  });

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      if (isEditMode) {
        return WarehouseService.updateWarehouse(existingWarehouse!._id, formData, signal);
      } else {
        return WarehouseService.createWarehouse(formData, signal);
      }
    },
    {
      onSuccess: warehouse => {
        reset();
        onSubmit(warehouse);
      },
      onError: error => {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} warehouse:`, error);
      },
    }
  );

  const onFormSubmit = (formData: FormData) => {
    submit(formData);
  };

  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>
        {isEditMode ? 'Edit Warehouse' : 'Create Warehouse'}
      </ModalHeader>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent>
            <Grid className="gap-y-4.5">
              <GridCell>
                <TextFormField
                  label="Warehouse Code"
                  name="code"
                  isRequired
                  control={control}
                  error={errors.code}
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  label="Warehouse Name"
                  name="name"
                  isRequired
                  control={control}
                  error={errors.name}
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <CompanyDropdown
                      value={field.value}
                      className="w-full"
                      onSelect={value => field.onChange(value._id)}
                      hasError={!!fieldState.error}
                      isRequired={true}
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="sapWarehouses"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SapWarehousesDropdown
                      value={field.value}
                      className="w-full"
                      onSelect={value => field.onChange(value)}
                      hasError={!!fieldState.error}
                      isRequired={true}
                      companyId={watch('companyId')}
                      isDisabled={!getValues('companyId')}
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <FormSwitch
                  label="Bin Location Enabled"
                  name="isBinLocationEnabled"
                  control={control}
                />
              </GridCell>
              <GridCell>
                <FormSwitch label="Active" name="isActive" control={control} />
              </GridCell>
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
