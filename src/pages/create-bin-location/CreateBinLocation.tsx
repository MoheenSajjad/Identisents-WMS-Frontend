import { Form } from '@/components/ui/form';
import { Grid, GridCell } from '@/components/ui/grid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { NumberFormField, TextFormField } from '@/components/ui/formField';
import { FormSwitch } from '@/components/ui/form-switch';
import { ApiResponse } from '@/types/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IAllBinSubLevels } from '@/types/bin-sub-levels';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { BinSubLevelService } from '@/services/bin-sub-level-services';
import { OpacityWrapper } from '@/components/parts/opacity-wrapper';
import { WarehouseDropdown } from '@/components/parts/dropdowns/warehouse-dropdown';

import { BinSubLevelRowsDropdown } from '@/components/parts/dropdowns/bin-sub-level-rows-dropdown';
import { SubmitButton } from '@/components/parts/Buttons';
import Card from '@/components/parts/card/Card';
import { Paper } from '@/components/ui/Paper';
import { Button } from '@/components/ui/Button';
import { ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
import { IGeneratedBinLocation } from '@/components/parts/modals/bin-location-generated-codes-modal/columns';
import { useToggle } from '@/hooks/use-toggle';
import { GeneratedCodesModal } from '@/components/parts/modals/bin-location-generated-codes-modal';
import { GearLoading } from '@/components/ui/Loading/GearLoading';
import { PageTransition } from '@/components/parts/animations';
import { SAPItemGroupsDropdown } from '@/components/parts/dropdowns/sap-item-group-dropdown';
import { SapItemsDropdown } from '@/components/parts/dropdowns/sap-items-dropdown';
import { TextInput } from '@/components/ui/text-input';

const createFormSchema = () => {
  return z.object({
    warehouse: z.string().min(1, 'Warehouse is required'),
    fromBinSubLevel1: z.string().min(1, 'From Sub level 1 is required'),
    fromBinSubLevel2: z.string().min(1, 'From Sub level 2 is required'),
    fromBinSubLevel3: z.string().min(1, 'From Sub level 3 is required'),
    fromBinSubLevel4: z.string().min(1, 'From Sub level 4 is required'),
    toBinSubLevel1: z.string().min(1, 'To Sub level 1 is required'),
    toBinSubLevel2: z.string().min(1, 'To Sub level 2 is required'),
    toBinSubLevel3: z.string().min(1, 'To Sub level 3 is required'),
    toBinSubLevel4: z.string().min(1, 'To Sub level 4 is required'),
    capacity: z.coerce.number().gt(0).min(1, 'Capacity is required'),

    itemGroup: z.object({
      Number: z.string().min(1, 'Group Number is required'),
      GroupName: z.string().min(1, 'Group Name is required'),
    }),

    itemName: z.object({
      ItemCode: z.string().min(1, 'Item Code is required'),
      ItemName: z.string().min(1, 'Item Name is required'),
    }),

    uom: z.string().min(1, 'UOM is required'),
    isActive: z.boolean(),
  });
};

export const CreateBinLocation = () => {
  const [generatedCode, setGeneratedCodes] = useState<IGeneratedBinLocation[] | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();
  const { toggleOff, toggleOn, isToggled } = useToggle();

  const fetchBinSubLevels = useCallback(
    (signal: AbortSignal) => BinSubLevelService.getAll(signal),
    []
  );

  const { data: binSubLevelsResponse } =
    useFetch<ApiResponse<IAllBinSubLevels[]>>(fetchBinSubLevels);

  const binSubLevelOptions = useMemo(
    () => binSubLevelsResponse?.data ?? [],
    [binSubLevelsResponse]
  );

  const sortedLevels = useMemo(() => {
    return [...binSubLevelOptions].sort((a, b) => a.level - b.level);
  }, [binSubLevelOptions]);
  console.log('sorted values', sortedLevels);

  const createDefaultValues = useMemo(() => {
    const defaultValues: Record<string, any> = {
      warehouse: '',
      capacity: 0,
      itemGroup: {
        Number: '',
        GroupName: '',
      },

      itemName: {
        ItemCode: '',
        ItemName: '',
      },

      uom: '',
      isActive: true,
    };

    sortedLevels.forEach(level => {
      const levelKey = level.level;
      defaultValues[`fromBinSubLevel${levelKey}`] = '';
      defaultValues[`toBinSubLevel${levelKey}`] = '';
    });

    return defaultValues;
  }, [sortedLevels]);

  const formSchema = useMemo(() => createFormSchema(), [sortedLevels]);
  type FormData = z.infer<typeof formSchema>;

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues,
  });

  const watchedValues = watch();

  const isSelectionValid = useCallback(
    (fromValue: string, toValue: string, level: IAllBinSubLevels) => {
      if (!fromValue || !toValue) {
        return true;
      }

      const fromRow = level.rows.find(row => row.code === fromValue);
      const toRow = level.rows.find(row => row.code === toValue);

      if (fromRow && toRow && fromRow.serialNumber && toRow.serialNumber) {
        return toRow.serialNumber >= fromRow.serialNumber;
      }

      return true;
    },
    []
  );

  const getValidationErrorMessage = useCallback(
    (fromValue: string, toValue: string, level: IAllBinSubLevels) => {
      if (!fromValue || !toValue) {
        return undefined;
      }

      const fromRow = level.rows.find(row => row.code === fromValue);
      const toRow = level.rows.find(row => row.code === toValue);

      if (fromRow && toRow && fromRow.serialNumber && toRow.serialNumber) {
        if (toRow.serialNumber > fromRow.serialNumber) {
          return `To selection (Serial: ${toRow.serialNumber}) cannot have a higher serial number than From selection (Serial: ${fromRow.serialNumber})`;
        }
      }

      return undefined;
    },
    []
  );

  const { submit, isSubmitting } = useFormSubmit(
    (formData: FormData, signal: AbortSignal) => {
      return BinLocationService.generateCodes(formData, signal);
    },
    {
      onSuccess: data => {
        setGeneratedCodes(data.data);
        setTimeout(() => toggleOn(), 2000);
      },
      onError: error => {
        console.error(`Error`, error);
      },
    }
  );
  const handleFormSubmit = (data: FormData) => {
    let hasValidationErrors = false;

    sortedLevels.forEach(level => {
      const levelKey = level.level;
      const fromValue = data[`fromBinSubLevel${levelKey}` as keyof FormData] as string;
      const toValue = data[`toBinSubLevel${levelKey}` as keyof FormData] as string;

      if (!isSelectionValid(fromValue, toValue, level)) {
        hasValidationErrors = true;
      }
    });

    if (hasValidationErrors) {
      console.log('Form has validation errors, submission prevented');
      return;
    }

    console.log('Submitted:', data);
    submit(data);
    // reset();/
  };

  useEffect(() => {
    if (isSubmitting) {
      setShowLoading(true);
    } else if (showLoading) {
      const timeout = setTimeout(() => {
        setShowLoading(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isSubmitting]);

  console.log(getValues(), errors);

  return (
    <>
      {isToggled && generatedCode && (
        <GeneratedCodesModal
          data={generatedCode}
          onSubmit={() => {
            toggleOff();
            navigate('/bin-locations');
          }}
          onCancel={toggleOff}
        />
      )}
      <Paper>
        <PageTransition animation="slide">
          <GearLoading isLoading={showLoading && !isToggled} text="Generating Codes...">
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
              <Paper.BigTitle title="Create Bin Location">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant={Button.Variant.OUTLINE}
                    icon={<ArrowLeftCircle />}
                    onClick={() => navigate('/bin-locations')}
                  >
                    Back
                  </Button>
                  <SubmitButton />
                </div>
              </Paper.BigTitle>

              <Card className="border border-gray-200">
                <Paper.Title title="Bin Location Properties" />

                <OpacityWrapper opacity={1} disabled={false}>
                  <Grid className="gap-y-4">
                    <GridCell size={Grid.CellSize.S3}>
                      <Controller
                        name="warehouse"
                        control={control}
                        render={({ field, fieldState }) => (
                          <WarehouseDropdown
                            value={field.value}
                            onSelect={w => {
                              field.onChange(w._id);
                              setCompanyId(w.companyId);
                            }}
                            hasError={!!fieldState.error}
                            isRequired
                          />
                        )}
                      />
                    </GridCell>

                    <GridCell size={Grid.CellSize.S3}>
                      <NumberFormField
                        label="Capacity"
                        name="capacity"
                        control={control}
                        placeholder="Capacity"
                        hasError={control.getFieldState('capacity').invalid}
                        isRequired
                      />
                    </GridCell>

                    <GridCell>
                      <Controller
                        name="itemGroup"
                        control={control}
                        render={({ field, fieldState }) => (
                          <SAPItemGroupsDropdown
                            value={field.value.Number}
                            className="w-full"
                            onSelect={value =>
                              field.onChange({
                                Number: value.Number,
                                GroupName: value.GroupName,
                              })
                            }
                            hasError={!!fieldState.error}
                            isRequired={true}
                            isDisabled={!companyId}
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
                            value={field.value.ItemCode}
                            className="w-full"
                            onSelect={value =>
                              field.onChange({
                                ItemCode: value.ItemCode,
                                ItemName: value.ItemName,
                              })
                            }
                            hasError={!!fieldState.error}
                            isRequired={true}
                            groupCode={watch('itemGroup')?.Number}
                            isDisabled={!watch('itemGroup')?.Number}
                            companyId={companyId}
                          />
                        )}
                      />
                    </GridCell>

                    <GridCell size={Grid.CellSize.S3}>
                      <Controller
                        name="itemName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextInput
                            label="Item Code"
                            value={field.value.ItemCode}
                            hasError={fieldState.invalid}
                            className="w-full"
                            isRequired
                            isDisabled
                          />
                        )}
                      />
                    </GridCell>

                    <GridCell size={Grid.CellSize.S3} className="flex-grow-0">
                      <TextFormField
                        label="UOM"
                        name="uom"
                        control={control}
                        placeholder="UOM"
                        hasError={control.getFieldState('uom').invalid}
                        isRequired
                      />
                    </GridCell>

                    <GridCell size={Grid.CellSize.S3} className="flex-grow-0">
                      <FormSwitch label="Active" name="isActive" control={control} />
                    </GridCell>
                  </Grid>
                </OpacityWrapper>

                <Paper.Title title="Bin Location Codes" />

                <div className="mt-4 space-y-4">
                  <Grid>
                    <GridCell size={Grid.CellSize.S3} className="flex-grow-0">
                      <h3 className="text-sm font-semibold text-gray-900">Bin Level</h3>
                    </GridCell>
                    <GridCell className="text-left">
                      <h3 className="text-sm font-semibold text-gray-900">From</h3>
                    </GridCell>
                    <GridCell className="text-left">
                      <h3 className="text-sm font-semibold text-gray-900">To</h3>
                    </GridCell>
                  </Grid>

                  <div className="space-y-4">
                    {sortedLevels.map(level => {
                      const levelKey = level.level;
                      const fromFieldName = `fromBinSubLevel${levelKey}` as keyof FormData;
                      const toFieldName = `toBinSubLevel${levelKey}` as keyof FormData;
                      const fromValue = watchedValues[fromFieldName] as string;
                      const toValue = watchedValues[toFieldName] as string;

                      return (
                        <Grid key={level._id}>
                          <GridCell size={Grid.CellSize.S3} className="flex-grow-0">
                            <span className="text-sm font-medium">{level.name}</span>
                          </GridCell>
                          <GridCell>
                            <Controller
                              name={fromFieldName}
                              control={control}
                              render={({ field, fieldState }) => (
                                <BinSubLevelRowsDropdown
                                  value={field.value as string}
                                  onSelect={row => field.onChange(row.code)}
                                  hasError={
                                    !!fieldState.error ||
                                    !isSelectionValid(field.value as string, toValue, level)
                                  }
                                  showLabel={false}
                                  options={level.rows}
                                  isRequired
                                  placeholder={`Select from ${level.name.toLowerCase()}...`}
                                  error={
                                    fieldState.error?.message ||
                                    getValidationErrorMessage(field.value as string, toValue, level)
                                  }
                                />
                              )}
                            />
                          </GridCell>

                          <GridCell>
                            <Controller
                              name={toFieldName}
                              control={control}
                              render={({ field, fieldState }) => (
                                <BinSubLevelRowsDropdown
                                  value={field.value as string}
                                  onSelect={row => field.onChange(row.code)}
                                  hasError={
                                    !!fieldState.error ||
                                    !isSelectionValid(fromValue, field.value as string, level)
                                  }
                                  showLabel={false}
                                  options={level.rows}
                                  isRequired
                                  placeholder={`Select to ${level.name.toLowerCase()}...`}
                                  error={
                                    fieldState.error?.message ||
                                    getValidationErrorMessage(
                                      fromValue,
                                      field.value as string,
                                      level
                                    )
                                  }
                                />
                              )}
                            />
                          </GridCell>
                        </Grid>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </Form>
          </GearLoading>
        </PageTransition>
      </Paper>
    </>
  );
};
