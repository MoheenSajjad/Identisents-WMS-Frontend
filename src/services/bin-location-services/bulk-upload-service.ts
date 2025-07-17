import { ApiResponse } from '@/types/api';
import { apiClient } from '@/utils/apiClient';

export interface ValidationError {
  row: number;
  field: string;
  message: string;
  code: string;
}

export interface GeneratedBinLocationCode {
  code: string;
  binSubLevel1: string;
  binSubLevel2: string;
  binSubLevel3: string;
  binSubLevel4: string;
  hasError: boolean;
  message?: string;
  capacity: number;
  itemGroup?: string;
  itemName?: string;
  itemCode?: string;
  uom?: string;
  warehouse: string;
  isActive: boolean;
}

export interface BulkUploadResult {
  success: boolean;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  errors: ValidationError[];
  generatedCodes: GeneratedBinLocationCode[];
  summary: string;
}

export interface BulkUploadResponse extends ApiResponse<BulkUploadResult> {}

export class BulkUploadService {
  static async downloadTemplate(signal?: AbortSignal): Promise<Blob> {
    const response = await apiClient.get('/api/binLocation/template/download', {
      responseType: 'blob',
      signal,
    });
    return response;
  }

  static async uploadExcelFile(
    file: File,
    signal?: AbortSignal
  ): Promise<BulkUploadResponse> {
    const formData = new FormData();
    formData.append('excelFile', file);

    const response = await apiClient.post<BulkUploadResponse>(
      '/api/binLocation/bulk-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal,
      }
    );

    return response;
  }
}