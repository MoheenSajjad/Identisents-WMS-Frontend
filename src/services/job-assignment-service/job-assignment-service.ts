import { ApiResponse } from '@/types/api';
import { IJobAssignment, IJobAssignmentDetail } from '@/types/job-assignment';
import { apiClient } from '@/utils/apiClient';

class JobAssignmentServices {
  static async getJobs(signal: AbortSignal): Promise<ApiResponse<IJobAssignment[]>> {
    return apiClient.get<ApiResponse<IJobAssignment[]>>(`api/jobAssignment`, {
      signal,
    });
  }

  static async getById(
    id: string,
    signal: AbortSignal
  ): Promise<ApiResponse<IJobAssignmentDetail>> {
    return apiClient.get<ApiResponse<IJobAssignmentDetail>>(`api/jobAssignment/${id}`, {
      signal,
    });
  }

  static async deleteJob(
    id: string,
    isDelete: boolean,
    signal: AbortSignal
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`api//${id}`, { signal });
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
    return apiClient.put<ApiResponse<void>>(
      `api/jobAssignment/${params.jobId}/assign`,
      params.data,
      {
        signal,
      }
    );
  }
}

export const JobAssignmentService = JobAssignmentServices;
