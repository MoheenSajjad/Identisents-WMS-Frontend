import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';

interface IButtonBaseProps {
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}
export const DeleteIconButton = ({ onClick, isDisabled, isLoading }: IButtonBaseProps) => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Trash />}
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

export const AddNewButton = () => {
  return (
    <Button variant={Button.Variant.PRIMARY} size={Button.Size.DEFAULT}>
      Add New
    </Button>
  );
};

export const ReloadButton = ({ onClick }: IButtonBaseProps) => {
  return (
    <Button variant={Button.Variant.OUTLINE} onClick={onClick}>
      Reload
    </Button>
  );
};
