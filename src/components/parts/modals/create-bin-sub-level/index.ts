export * from './CreateBinSublevel';

// import { Form } from '@/components/ui/form';
// import { Grid, GridCell } from '@/components/ui/grid';
// import { Loading } from '@/components/ui/Loading';
// import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
// import {
//   AddIconButton,
//   CancelButton,
//   DeleteIconButton,
//   HeaderButton,
//   SubmitButton,
// } from '../../Buttons';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Controller, useFieldArray, useForm } from 'react-hook-form';
// import { FormSwitch } from '@/components/ui/form-switch';
// import { SubLevelDropdown } from '../../dropdowns/sub-level-dropdown';
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableData,
//   type DragDropConfig,
// } from '@/components/ui/Table';
// import { TextFormField } from '@/components/ui/formField';
// import { IBinSubLevels } from '@/types/bin-sub-levels';
// import { useFormSubmit } from '@/hooks/use-form-submit';
// import { BinSubLevelService } from '@/services/bin-sub-level-services';
// import { OpacityWrapper } from '../../opacity-wrapper';

// interface ICreateBinSubLevelModalProps {
//   onCancel: () => void;
//   onSubmit: (data: IBinSubLevels) => void;
//   mode: 'create' | 'edit';
//   binSubLevel: IBinSubLevels | null;
// }

// const formSchema = z.object({
//   binLocationSubLevel: z.string().min(1, 'Sub level is required'),
//   isActive: z.boolean(),
//   rows: z
//     .array(
//       z.object({
//         code: z.string().min(1, 'Code is required'),
//         name: z.string().min(1, 'Name is required'),
//       })
//     )
//     .min(1, 'At least one bin is required'),
// });

// type FormData = z.infer<typeof formSchema>;

// export const CreateBinSubLevel: React.FC<ICreateBinSubLevelModalProps> = ({
//   onCancel,
//   onSubmit,
//   mode,
//   binSubLevel,
// }) => {
//   const isEditMode = mode === 'edit';

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       binLocationSubLevel: binSubLevel?.binLocationSubLevel?._id || '',
//       isActive: binSubLevel?.isActive ?? true,
//       rows: binSubLevel?.rows ?? [{ code: '', name: '' }],
//     },
//   });

//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: 'rows',
//   });

//   const dragDropConfig: DragDropConfig = {
//     enabled: false,
//     items: fields,
//     onReorder: reorderedFields => {
//       for (let newIndex = 0; newIndex < reorderedFields.length; newIndex++) {
//         const newItem = reorderedFields[newIndex];
//         const oldIndex = fields.findIndex(field => field.id === newItem.id);

//         if (oldIndex !== newIndex && oldIndex !== -1) {
//           move(oldIndex, newIndex);
//           break;
//         }
//       }
//     },
//     getItemId: item => item.id,
//   };

//   const isSubmitting = false;

//   const handleFormSubmit = (data: FormData) => {
//     // submit(data);
//   };

//   console.log(errors);

//   return (
//     <Modal size={Modal.Size.LARGE}>
//       <ModalHeader onClose={onCancel}>
//         {isEditMode ? 'Edit Bin Sub Level' : 'Create Bin Sub Level'}
//       </ModalHeader>
//       <Form onSubmit={handleSubmit(handleFormSubmit)}>
//         <OpacityWrapper opacity={isSubmitting ? 0.5 : 1} disabled={isSubmitting}>
//           <ModalContent>
//             <Grid className="gap-y-4.5">
//               <GridCell size={Grid.CellSize.S6}>
//                 <Controller
//                   name="binLocationSubLevel"
//                   control={control}
//                   render={({ field, fieldState }) => (
//                     <SubLevelDropdown
//                       className="w-full"
//                       value={field.value}
//                       onSelect={sub => field.onChange(sub._id)}
//                       hasError={!!fieldState.error}
//                       isRequired
//                     />
//                   )}
//                 />
//               </GridCell>
//               <GridCell>
//                 <FormSwitch label="Active" name="isActive" control={control} />
//               </GridCell>
//             </Grid>

//             <div className="mt-6">
//               <Table className="overflow-x-hidden rounded-md border border-gray-200">
//                 <TableHeader>
//                   <TableRow>
//                     {/* <TableHead className="w-12">
//                       <HeaderButton label="" showSortIcon={false} />
//                     </TableHead> */}
//                     <TableHead>
//                       <HeaderButton label="Code" showSortIcon={false} />
//                     </TableHead>
//                     <TableHead>
//                       <HeaderButton label="Name" showSortIcon={false} />
//                     </TableHead>
//                     <TableHead className="text-center">
//                       <HeaderButton label="Actions" showSortIcon={false} />
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody dragDropConfig={dragDropConfig}>
//                   {fields.map((field, index) => (
//                     <TableRow key={field.id} dragDropConfig={dragDropConfig} dragId={field.id}>
//                       {/* <TableData
//                         dragDropConfig={dragDropConfig}
//                         dragId={field.id}
//                         isDragHandle={true}
//                         className="text-center"
//                       /> */}
//                       <TableData>
//                         <TextFormField
//                           name={`rows.${index}.code`}
//                           control={control}
//                           placeholder="code"
//                         />
//                       </TableData>
//                       <TableData>
//                         <TextFormField
//                           name={`rows.${index}.name`}
//                           control={control}
//                           placeholder="name"
//                         />
//                       </TableData>
//                       <TableData className="text-center">
//                         <div className="flex justify-center gap-2">
//                           <AddIconButton onClick={() => append({ code: '', name: '' })} />
//                           {fields.length > 1 && <DeleteIconButton onClick={() => remove(index)} />}
//                         </div>
//                       </TableData>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
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
