// import { Form } from '@/components/ui/form';
// import { Grid, GridCell } from '@/components/ui/grid';
// import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Controller, useForm } from 'react-hook-form';
// import { NumberFormField, TextFormField } from '@/components/ui/formField';
// import { SubmitButton, CancelButton } from '@/components/parts/Buttons';
// import { IBinLocation } from '@/types/bin-location';
// import { useFormSubmit } from '@/hooks/use-form-submit';
// import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
// import { BinSubLevelDropdown } from '../../dropdowns/bin-sub-level-dropdown';
// import { WarehouseDropdown } from '../../dropdowns/warehouse-dropdown';
// import { OpacityWrapper } from '../../opacity-wrapper';
// import { FormSwitch } from '@/components/ui/form-switch';
// import { ApiResponse } from '@/types/api';
// import { useCallback, useMemo } from 'react';
// import { IBinSubLevels } from '@/types/bin-sub-levels';
// import { useFetch } from '@/hooks/use-fetch/use-fetch';
// import { BinSubLevelService } from '@/services/bin-sub-level-services';

// interface ICreateBinLocationModalProps {
//   onCancel: () => void;
//   onSubmit: (data: IBinLocation) => void;
//   mode: 'create' | 'edit';
//   binLocation: IBinLocation | null;
// }

// const formSchema = z.object({
//   warehouse: z.string().min(1, 'Warehouse is required'),
//   binSubLevel1: z.string().min(1, 'Sub level 1 is required'),
//   binSubLevel2: z.string().min(1, 'Sub level 2 is required'),
//   binSubLevel3: z.string().min(1, 'Sub level 3 is required'),
//   binSubLevel4: z.string().min(1, 'Sub level 4 is required'),
//   binSubLevel5: z.string().min(1, 'Sub level 5 is required'),
//   capacity: z.coerce.number().gt(0).min(1, 'Capacity is required'),
//   itemGroup: z.string().min(1, 'Item Group is required'),
//   itemCode: z.string().min(1, 'Item Code is required'),
//   itemName: z.string().min(1, 'Item Name is required'),
//   uom: z.string().min(1, 'UOM is required'),
//   isActive: z.boolean(),
// });

// type FormData = z.infer<typeof formSchema>;

// export const CreateBinLocation: React.FC<ICreateBinLocationModalProps> = ({
//   onCancel,
//   onSubmit,
//   mode,
//   binLocation,
// }) => {
//   const isEditMode = mode === 'edit';

//   const {
//     control,
//     handleSubmit,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       warehouse: binLocation?.warehouse?._id ?? '',
//       binSubLevel1: binLocation?.binSubLevel1?._id ?? '',
//       binSubLevel2: binLocation?.binSubLevel2?._id ?? '',
//       binSubLevel3: binLocation?.binSubLevel3?._id ?? '',
//       binSubLevel4: binLocation?.binSubLevel4?._id ?? '',
//       binSubLevel5: binLocation?.binSubLevel5?._id ?? '',
//       capacity: binLocation?.capacity ?? 0,
//       itemGroup: binLocation?.itemGroup ?? '',
//       itemCode: binLocation?.itemCode ?? '',
//       itemName: binLocation?.itemName ?? '',
//       uom: binLocation?.uom ?? '',
//       isActive: binLocation?.isActive ?? true,
//     },
//   });

//   const { submit, isSubmitting } = useFormSubmit(
//     (formData: FormData, signal: AbortSignal) => {
//       if (isEditMode && binLocation) {
//         return BinLocationService.updateBinLocation(binLocation._id, formData, signal);
//       } else {
//         return BinLocationService.createBinLocation(formData, signal);
//       }
//     },
//     {
//       onSuccess: response => {
//         reset();
//         onSubmit(response.data);
//       },
//       onError: error => {
//         console.error('Error submitting bin location:', error);
//       },
//     }
//   );

//   const handleFormSubmit = (data: FormData) => {
//     submit(data);
//   };

//   console.log(errors, getValues());

//   const fetchBinSubLevels = useCallback(
//     (signal: AbortSignal) => BinSubLevelService.getBinSubLevels(signal),
//     []
//   );

//   const { data: binSubLevelsResponse, isLoading: isBinSubLevelLoading } =
//     useFetch<ApiResponse<IBinSubLevels[]>>(fetchBinSubLevels);

//   const binSubLevelOptions = useMemo(
//     () => binSubLevelsResponse?.data ?? [],
//     [binSubLevelsResponse]
//   );

//   return (
//     <Modal size={Modal.Size.LARGE}>
//       <ModalHeader onClose={onCancel}>
//         {isEditMode ? 'Edit Bin Location' : 'Create Bin Location'}
//       </ModalHeader>
//       <Form onSubmit={handleSubmit(handleFormSubmit)}>
//         <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
//           <ModalContent>
//             <Grid className="gap-y-4">
//               <GridCell size={Grid.CellSize.S3}>
//                 <Controller
//                   name="warehouse"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <WarehouseDropdown
//                       value={field.value}
//                       onSelect={w => field.onChange(w._id)}
//                       hasError={!!fieldState.error}
//                       isRequired
//                     />
//                   )}
//                 />
//               </GridCell>

//               {[1, 2, 3, 4, 5].map(level => (
//                 <GridCell size={Grid.CellSize.S3} key={level}>
//                   <Controller
//                     name={`binSubLevel${level}` as keyof FormData}
//                     control={control}
//                     render={({ field, fieldState }) => (
//                       <BinSubLevelDropdown
//                         label={`Sub Level ${level}`}
//                         options={binSubLevelOptions}
//                         value={field.value as string}
//                         onSelect={sub => field.onChange(sub._id)}
//                         hasError={!!fieldState.error}
//                         isRequired
//                       />
//                     )}
//                   />
//                 </GridCell>
//               ))}

//               <GridCell size={Grid.CellSize.S3}>
//                 <NumberFormField
//                   label="Capacity"
//                   name="capacity"
//                   control={control}
//                   placeholder="Capacity"
//                   hasError={control.getFieldState('itemGroup').invalid}
//                   isRequired
//                 />
//               </GridCell>

//               <GridCell size={Grid.CellSize.S3}>
//                 <TextFormField
//                   label="Item Group"
//                   name="itemGroup"
//                   control={control}
//                   placeholder="Item Group"
//                   hasError={control.getFieldState('itemGroup').invalid}
//                   isRequired
//                 />
//               </GridCell>

//               <GridCell size={Grid.CellSize.S3}>
//                 <TextFormField
//                   label="Item Code"
//                   name="itemCode"
//                   control={control}
//                   placeholder="Item Code"
//                   hasError={control.getFieldState('itemCode').invalid}
//                   isRequired
//                 />
//               </GridCell>

//               <GridCell size={Grid.CellSize.S4} className="flex-grow-0">
//                 <TextFormField
//                   label="Item Name"
//                   name="itemName"
//                   control={control}
//                   placeholder="Item Name"
//                   hasError={control.getFieldState('itemName').invalid}
//                   isRequired
//                 />
//               </GridCell>

//               <GridCell size={Grid.CellSize.S4} className="flex-grow-0">
//                 <TextFormField
//                   label="UOM"
//                   name="uom"
//                   control={control}
//                   placeholder="UOM"
//                   hasError={control.getFieldState('uom').invalid}
//                   isRequired
//                 />
//               </GridCell>
//               <GridCell>
//                 <FormSwitch label="Active" name="isActive" control={control} />
//               </GridCell>
//             </Grid>
//           </ModalContent>
//         </OpacityWrapper>
//         <ModalFooter>
//           <SubmitButton isLoading={isSubmitting} isDisabled={isSubmitting} />
//           <CancelButton
//             isDisabled={isSubmitting}
//             onClick={() => {
//               reset();
//               onCancel();
//             }}
//           />
//         </ModalFooter>
//       </Form>
//     </Modal>
//   );
// };
