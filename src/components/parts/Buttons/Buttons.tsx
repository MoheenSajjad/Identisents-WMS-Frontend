import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';

export const DeleteIconButton = () => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Trash />}
      variant={Button.Variant.GHOST}
      color={Button.Color.DANGER}
      roundness={Button.Roundness.FULL}
      className="ml-1"
    />
  );
};

export const EditIconButton = () => {
  return (
    <Button
      size={Button.Size.ICON}
      icon={<Icons.Edit className="!h-4 !w-4" />}
      variant={Button.Variant.GHOST}
      color={Button.Color.PRIMARY}
      roundness={Button.Roundness.FULL}
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

export const ReloadButton = () => {
  return <Button variant={Button.Variant.OUTLINE}>Reload</Button>;
};
