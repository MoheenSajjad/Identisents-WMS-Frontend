import { Form } from '@/components/ui/form';
import { TextFormField } from '@/components/ui/formField';
import { Grid, GridCell } from '@/components/ui/grid';
import { Loading } from '@/components/ui/Loading';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { IWarehouse } from '@/types/warehouse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CancelButton, SubmitButton } from '../../Buttons';
import { FormSwitch } from '@/components/ui/form-switch';
import { SapWarehousesDropdown } from '../../dropdowns/sap-warehouses-dropdown';

interface ICreateWarehouseModalProps {
  mode: 'edit' | 'create';
  warehouse: IWarehouse | null;
  onSubmit: (warehouse: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1),
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
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isEditMode ? existingWarehouse?.name || '' : '',
      sapWarehouses: isEditMode ? existingWarehouse?.sapWarehouses || [] : [],
      isBinLocationEnabled: isEditMode ? (existingWarehouse?.isBinLocationEnabled ?? true) : true,
      isActive: isEditMode ? (existingWarehouse?.isActive ?? true) : true,
    },
  });

  return (
    <Modal size={Modal.Size.LARGE}>
      <ModalHeader onClose={onCancel}>
        {isEditMode ? 'Edit Warehouse' : 'Create Warehouse'}
      </ModalHeader>
      <Form onSubmit={() => {}}>
        <Loading isLoading={false}>
          <ModalContent>
            <Grid className="gap-y-4.5">
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
                <FormSwitch
                  label="Bin Location Enabled"
                  name="isBinLocationEnabled"
                  control={control}
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
                      onValueChange={value => field.onChange(value)}
                      error={undefined}
                      isRequired={true}
                    />
                  )}
                />
              </GridCell>
            </Grid>
          </ModalContent>
        </Loading>
        <ModalFooter>
          <SubmitButton isLoading={false} isDisabled={false} />
          <CancelButton onClick={onCancel} isDisabled={false} />
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 699 },
  { id: 3, name: 'Book', category: 'Education', price: 29 },
  { id: 4, name: 'Headphones', category: 'Electronics', price: 199 },
];
