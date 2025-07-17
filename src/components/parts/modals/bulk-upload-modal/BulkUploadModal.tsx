import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal, ModalHeader, ModalContent } from '@/components/ui/modal/Modal';
import { GearLoading } from '@/components/ui/Loading/GearLoading';
import { Upload, Download, FileSpreadsheet, X } from 'lucide-react';
import {
  BulkUploadService,
  ValidationError,
  BulkUploadResult,
  GeneratedBinLocationCode,
} from '@/services/bin-location-services/bulk-upload-service';
import { notify } from '@/utils/notify/notify';
import { GeneratedCodesModal } from '@/components/parts/modals/bin-location-generated-codes-modal/BinLocationGeneratedCodesModal';
import { IGeneratedBinLocation } from '@/components/parts/modals/bin-location-generated-codes-modal/columns';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadState {
  file: File | null;
  uploading: boolean;
  downloadingTemplate: boolean;
  result: BulkUploadResult | null;
  showGeneratedCodes: boolean;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [state, setState] = useState<UploadState>({
    file: null,
    uploading: false,
    downloadingTemplate: false,
    result: null,
    showGeneratedCodes: false,
  });

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedTypes.includes(file.type)) {
        notify.error('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        notify.error('File size must be less than 10MB');
        return;
      }

      setState(prev => ({ ...prev, file, result: null }));
    }
  }, []);

  const handleDownloadTemplate = useCallback(async () => {
    setState(prev => ({ ...prev, downloadingTemplate: true }));

    try {
      const blob = await BulkUploadService.downloadTemplate();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bin-locations-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notify.success('Template downloaded successfully');
    } catch (error) {
      console.error('Download template error:', error);
      notify.error('Failed to download template');
    } finally {
      setState(prev => ({ ...prev, downloadingTemplate: false }));
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!state.file) {
      notify.error('Please select a file to upload');
      return;
    }

    setState(prev => ({ ...prev, uploading: true }));

    try {
      const response = await BulkUploadService.uploadExcelFile(state.file);

      setState(prev => ({
        ...prev,
        uploading: false,
        result: response.data,
        showGeneratedCodes: true,
      }));
      console.log(response);

      if (response.data?.totalRecords > 0) {
        notify.success(
          `Generated ${response.data.totalRecords} bin location codes. ${response.data.validRecords} are valid.`
        );
      } else {
        notify.warning(response.message || 'No codes generated');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setState(prev => ({ ...prev, uploading: false }));

      notify.error(error.response?.data?.message || 'Failed to upload file');
    }
  }, [state.file]);

  const handleClose = useCallback(() => {
    setState({
      file: null,
      uploading: false,
      downloadingTemplate: false,
      result: null,
      showGeneratedCodes: false,
    });
    onClose();
  }, [onClose]);

  const handleGeneratedCodesSubmit = useCallback(() => {
    setState(prev => ({ ...prev, showGeneratedCodes: false }));
    handleClose();
    onSuccess();
  }, [handleClose, onSuccess]);

  const handleGeneratedCodesCancel = useCallback(() => {
    setState(prev => ({ ...prev, showGeneratedCodes: false }));
  }, []);

  const convertToGeneratedBinLocation = (
    codes: GeneratedBinLocationCode[]
  ): IGeneratedBinLocation[] => {
    return codes.map(code => ({
      code: code.code,
      binSubLevel1: code.binSubLevel1,
      binSubLevel2: code.binSubLevel2,
      binSubLevel3: code.binSubLevel3,
      binSubLevel4: code.binSubLevel4,
      hasError: code.hasError,
      message: code.message,
      capacity: code.capacity,
      itemCode: code.itemCode || code.code,
      warehouse: code.warehouse,
      isActive: code.isActive,
      itemGroup: code.itemGroup || '',
      itemName: code.itemName || '',
      uom: code.uom || '',
    }));
  };

  if (!isOpen) return null;

  // Show GeneratedCodesModal if codes are generated
  if (state.showGeneratedCodes && state.result?.generatedCodes) {
    return (
      <GeneratedCodesModal
        data={convertToGeneratedBinLocation(state.result.generatedCodes)}
        onSubmit={handleGeneratedCodesSubmit}
        onCancel={handleGeneratedCodesCancel}
      />
    );
  }

  return (
    <Modal size={Modal.Size.MEDIUM}>
      <ModalHeader onClose={handleClose}>Bulk Upload Bin Locations</ModalHeader>
      <ModalContent>
        <GearLoading isLoading={state.uploading} text="Processing upload...">
          <div className="space-y-4">
            {/* Template Download Section */}
            <div className="rounded-lg border border-gray-200 p-3">
              <h3 className="mb-2 text-base font-medium text-gray-900">
                Step 1: Download Template
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Download the Excel template and fill in your bin location data.
              </p>
              <Button
                variant={Button.Variant.OUTLINE}
                onClick={handleDownloadTemplate}
                disabled={state.downloadingTemplate}
                className="w-full"
              >
                {state.downloadingTemplate ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Downloading...
                  </div>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </>
                )}
              </Button>
            </div>

            {/* File Upload Section */}
            <div className="rounded-lg border border-gray-200 p-3">
              <h3 className="mb-2 text-base font-medium text-gray-900">
                Step 2: Upload Filled Template
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Select the completed Excel file to upload.
              </p>

              <div className="space-y-3">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <FileSpreadsheet className="mb-1 h-6 w-6 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>

                {state.file && (
                  <div className="flex items-center gap-2 rounded-md bg-green-50 p-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">{state.file.name}</span>
                    <Button
                      variant={Button.Variant.GHOST}
                      size={Button.Size.SMALL}
                      onClick={() => setState(prev => ({ ...prev, file: null }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                variant={Button.Variant.PRIMARY}
                onClick={handleUpload}
                disabled={!state.file || state.uploading}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </Button>
              <Button variant={Button.Variant.OUTLINE} onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </GearLoading>
      </ModalContent>
    </Modal>
  );
};
