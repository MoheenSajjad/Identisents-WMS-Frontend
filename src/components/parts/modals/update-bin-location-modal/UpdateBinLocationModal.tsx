import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Form } from '@/components/ui/form';
import { CancelButton, SubmitButton } from '@/components/parts/Buttons';
import {
  ISAPItemGroup,
  SAPItemGroupsDropdown,
} from '@/components/parts/dropdowns/sap-item-group-dropdown';
import { ISAPItem, SapItemsDropdown } from '@/components/parts/dropdowns/sap-items-dropdown';
import { NumberFormField, TextFormField } from '@/components/ui/formField';
import { FormSwitch } from '@/components/ui/form-switch';
import { IBinLocation } from '@/types/bin-location';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
import { useEffect } from 'react';
import { Grid, GridCell } from '@/components/ui/grid';
import { OpacityWrapper } from '../../opacity-wrapper';

const updateBinLocationSchema = z.object({
  itemGroup: z.string().min(1, 'Group Number is required'),
  itemGroupCode: z.string().min(1),
  itemName: z.string(),
  itemCode: z.string(),
  uom: z.string().min(1, 'UOM is required'),
  capacity: z.coerce.number().gt(0, 'Capacity must be greater than 0'),
  isActive: z.boolean(),
});

type UpdateBinLocationFormData = z.infer<typeof updateBinLocationSchema>;

interface UpdateBinLocationModalProps {
  open: boolean;
  onClose: () => void;
  binLocation: IBinLocation;
  onSuccess: () => void;
  companyId: string;
}

export const UpdateBinLocationModal = ({
  open,
  onClose,
  binLocation,
  onSuccess,
  companyId,
}: UpdateBinLocationModalProps) => {
  const form = useForm<UpdateBinLocationFormData>({
    resolver: zodResolver(updateBinLocationSchema),
    defaultValues: {
      itemGroup: binLocation.itemGroup,
      itemGroupCode: binLocation.itemGroupCode,
      itemName: binLocation.itemName,
      itemCode: binLocation.itemCode,
      uom: binLocation.uom,
      capacity: binLocation.capacity,
      isActive: binLocation.isActive,
    },
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { submit: updateBinLocation, isSubmitting } = useFormSubmit(
    (data: UpdateBinLocationFormData, signal: AbortSignal) =>
      BinLocationService.updateBinLocation(
        binLocation._id,
        {
          itemGroup: data.itemGroup,
          itemGroupCode: data.itemGroupCode,
          itemName: data.itemName,
          itemCode: data.itemCode,
          uom: data.uom,
          capacity: data.capacity,
          isActive: data.isActive,
        },
        signal
      ),
    {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    }
  );

  const onSubmit = async (data: UpdateBinLocationFormData) => {
    await updateBinLocation(data);
  };

  useEffect(() => {
    if (binLocation) {
      form.reset({
        itemGroup: binLocation.itemGroup,
        itemGroupCode: binLocation.itemGroupCode,
        itemName: binLocation.itemName,
        itemCode: binLocation.itemCode,
        uom: binLocation.uom,
        capacity: binLocation.capacity,
        isActive: binLocation.isActive,
      });
    }
  }, [binLocation, form]);

  if (!open) return null;

  return (
    <Modal size={Modal.Size.MEDIUM} onClose={onClose}>
      <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
        <ModalHeader onClose={onClose}>Update Bin Location - {binLocation.code}</ModalHeader>
        <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
          <ModalContent>
            <Grid className="gap-y-4.5">
              <GridCell>
                <NumberFormField
                  control={control}
                  name="capacity"
                  label="Capacity"
                  placeholder="Enter capacity"
                  hasError={control.getFieldState('capacity').invalid}
                  isRequired
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="itemGroupCode"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SAPItemGroupsDropdown
                      value={field.value || ''}
                      className="w-full"
                      onSelect={value => {
                        setValue('itemGroupCode', value.Number);
                        setValue('itemGroup', value.GroupName);
                        setValue('itemName', '');
                        setValue('itemCode', '');
                        setValue('uom', '');
                      }}
                      hasError={!!fieldState.error}
                      isRequired
                      companyId={companyId}
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <Controller
                  name="itemName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SapItemsDropdown
                      value={watch('itemCode') ?? ''}
                      className="w-full"
                      onSelect={value => {
                        setValue('itemCode', value?.ItemCode ?? '');
                        setValue('itemName', value?.ItemName ?? '');
                      }}
                      hasError={!!fieldState.error}
                      groupCode={watch('itemGroupCode')}
                      isDisabled={!watch('itemGroupCode')}
                      companyId={companyId}
                    />
                  )}
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  control={control}
                  name="itemCode"
                  label="Item Code"
                  className="bg-gray-50"
                  hasError={control.getFieldState('itemCode').invalid}
                  isDisabled
                />
              </GridCell>
              <GridCell>
                <TextFormField
                  control={control}
                  name="uom"
                  isRequired
                  label="UOM"
                  placeholder="Enter UOM"
                  hasError={control.getFieldState('uom').invalid}
                />
              </GridCell>
              <GridCell>
                <FormSwitch control={control} name="isActive" label="Active" />
              </GridCell>
            </Grid>
          </ModalContent>
        </OpacityWrapper>
        <ModalFooter>
          <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} />
          <CancelButton onClick={onClose} isDisabled={isSubmitting} />
        </ModalFooter>
      </Form>
    </Modal>
  );
};
