import { ApiResponse, PaginatedResponse } from '@/types/api';
import { IJobAssignment, IJobAssignmentDetail } from '@/types/job-assignment';
import { apiClient } from '@/utils/apiClient';
import { successHandler, successHandlers } from '@/utils/handlers/successHandler';
import { errorHandler } from '@/utils/handlers/errorHandler';

const ENTITY = 'Job Assignment';

class JobAssignmentServices {
  static async getJobs(
    page: number,
    signal: AbortSignal
  ): Promise<ApiResponse<PaginatedResponse<IJobAssignment[]>>> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<IJobAssignment[]>>>(
        `api/jobAssignment?page=${page}`,
        {
          signal,
        }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async getById(
    id: string,
    signal: AbortSignal
  ): Promise<ApiResponse<IJobAssignmentDetail>> {
    try {
      const response = await apiClient.get<ApiResponse<IJobAssignmentDetail>>(
        `api/jobAssignment/${id}`,
        { signal }
      );
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async deleteJob(
    id: string,
    isDelete: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `api/jobAssignment/${id}?isDelete=${!isDelete}`,
        { signal }
      );

      if (!response.success) throw response;

      successHandlers.delete(response, ENTITY);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }

  static async assignJob(
    params: {
      data: {
        employeeId: string;
        remarks: string;
      };
      jobId: string;
    },
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(
        `api/jobAssignment/${params.jobId}/assign`,
        params.data,
        { signal }
      );

      if (!response.success) throw response;

      successHandler(response);
      return response;
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }
}

export const JobAssignmentService = JobAssignmentServices;
