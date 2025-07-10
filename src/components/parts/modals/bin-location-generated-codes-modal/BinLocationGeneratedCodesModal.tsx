import { useMemo } from 'react';
import { getGeneratedCodesColumns, IGeneratedBinLocation } from './columns';
import { useDataTable } from '@/hooks/use-data-tabel';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Button } from '@/components/ui/Button';
import { DataTable } from '../../Datatable';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { BinLocationService } from '@/services/bin-location-services/bin-location-services';
import { OpacityWrapper } from '../../opacity-wrapper';
import { GearLoading } from '@/components/ui/Loading/GearLoading';

interface GeneratedCodesModalProps {
  data: IGeneratedBinLocation[];
  onSubmit: () => void;
  onCancel: () => void;
}

export const GeneratedCodesModal: React.FC<GeneratedCodesModalProps> = ({
  data,
  onSubmit,
  onCancel,
}) => {
  const columns = useMemo(() => getGeneratedCodesColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: -1,
  });

  const errorCount = data.filter(item => item.hasError).length;
  const successCount = data.length - errorCount;

  const { submit, isSubmitting } = useFormSubmit(
    (formData: IGeneratedBinLocation[], signal: AbortSignal) => {
      return BinLocationService.createBulkBinLocations(data, signal);
    },
    {
      onSuccess: data => {
        onSubmit();
      },
      onError: error => {
        console.error(`Error`, error);
      },
    }
  );

  const handleSubmit = () => {
    submit(data);
  };

  return (
    <Modal size={Modal.Size.XXLARGE} onClose={onCancel}>
      <ModalHeader onClose={onCancel}>Generated Bin Location Codes</ModalHeader>
      <GearLoading isLoading={isSubmitting} text="Generating Bin Locations">
        <ModalContent className="flex h-[calc(100vh-120px)] flex-col overflow-hidden">
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <div className="flex-1">{/* Empty div to push content to the right */}</div>
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="font-medium text-green-600">Success: {successCount}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-red-600">Errors: {errorCount}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-600">Total: {data.length}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <DataTable table={table} isLoading={false} />
          </div>
        </ModalContent>
      </GearLoading>
      <ModalFooter>
        <Button variant={Button.Variant.OUTLINE} onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant={Button.Variant.PRIMARY}
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Bin Locations'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
