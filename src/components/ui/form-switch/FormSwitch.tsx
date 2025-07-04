import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

interface ControlledSwitchProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  disabled?: boolean;
  tooltip?: string;
  direction?: 'horizontal' | 'vertical';
}

export const FormSwitch = <T extends Record<string, any>>({
  name,
  control,
  label,
  disabled = false,
  tooltip,
  direction = 'vertical',
}: ControlledSwitchProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <Switch
            label={label}
            checked={field.value}
            onChange={field.onChange}
            disabled={disabled}
            tooltip={tooltip}
          />
        </div>
      )}
    />
  );
};
