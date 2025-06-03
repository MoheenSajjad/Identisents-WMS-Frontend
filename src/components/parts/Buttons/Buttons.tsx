import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';

interface IBaseButtonProps {
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}
export const DeleteIconButton = ({ onClick, isDisabled, isLoading }: IBaseButtonProps) => {
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

export const EditIconButton = ({ onClick, isDisabled }: IBaseButtonProps) => {
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
  return <Button>Add New</Button>;
};

export const ReloadButton = ({ onClick, isDisabled }: IBaseButtonProps) => {
  return (
    <Button onClick={onClick} disabled={isDisabled}>
      Reload
    </Button>
  );
};
