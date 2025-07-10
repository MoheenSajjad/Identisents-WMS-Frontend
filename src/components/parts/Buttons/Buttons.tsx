import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { Loader } from 'lucide-react';

interface IButtonBaseProps {
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  label?: string;
}
export const DeleteIconButton = ({
  onClick,
  isDisabled,
  isLoading,
  className,
}: IButtonBaseProps) => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Trash />}
      disabled={isDisabled}
      variant={Button.Variant.GHOST}
      color={Button.Color.DANGER}
      roundness={Button.Roundness.FULL}
      className={`ml-1 ${className}`}
      onClick={onClick}
      loading={isLoading}
    />
  );
};

export const RestoreIconButton = ({ onClick, isDisabled, isLoading }: IButtonBaseProps) => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.RestoreArchive />}
      disabled={isDisabled}
      variant={Button.Variant.GHOST}
      color={Button.Color.DANGER}
      roundness={Button.Roundness.FULL}
      className="ml-1"
      onClick={onClick}
      loading={isLoading}
    />
  );
};

export const EditIconButton = ({ onClick, isDisabled }: IButtonBaseProps) => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Edit className="!h-4 !w-4" />}
      disabled={isDisabled}
      variant={Button.Variant.GHOST}
      color={Button.Color.PRIMARY}
      roundness={Button.Roundness.FULL}
      onClick={onClick}
    />
  );
};

export const AddIconButton = ({ onClick, isDisabled }: IButtonBaseProps) => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Plus className="!h-4 !w-4" />}
      disabled={isDisabled}
      variant={Button.Variant.GHOST}
      color={Button.Color.PRIMARY}
      roundness={Button.Roundness.FULL}
      onClick={onClick}
    />
  );
};

export const AddNewButton = ({ onClick }: IButtonBaseProps) => {
  return (
    <Button variant={Button.Variant.PRIMARY} size={Button.Size.DEFAULT} onClick={onClick}>
      Add New
    </Button>
  );
};

export const ReloadButton = ({ onClick }: IButtonBaseProps) => {
  return (
    <Button variant={Button.Variant.OUTLINE} icon={<Loader />} onClick={onClick}>
      Reload
    </Button>
  );
};

export const SubmitButton = ({ isDisabled, isLoading }: IButtonBaseProps) => {
  return (
    <Button
      variant={Button.Variant.PRIMARY}
      size={Button.Size.DEFAULT}
      loading={isLoading}
      disabled={isDisabled}
      type="submit"
    >
      Submit
    </Button>
  );
};

export const CancelButton = ({ onClick }: IButtonBaseProps) => {
  return (
    <Button variant={Button.Variant.OUTLINE} onClick={onClick}>
      Cancel
    </Button>
  );
};

export const HeaderButton = ({
  onClick,
  label,
  className,
  showSortIcon = true,
}: IButtonBaseProps & { showSortIcon?: boolean }) => {
  return (
    <Button
      variant={Button.Variant.GHOST}
      className={`${className}`}
      onClick={onClick}
      suffixIcon={showSortIcon && <Icons.ArrowUpDown className="ml-2" />}
    >
      {label}
    </Button>
  );
};
