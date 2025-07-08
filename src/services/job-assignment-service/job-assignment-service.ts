import { ApiResponse } from '@/types/api';
import { IJobAssignment } from '@/types/job-assignment';
import { apiClient } from '@/utils/apiClient';

class JobAssignmentServices {
  static async getJobs(signal: AbortSignal): Promise<ApiResponse<IJobAssignment[]>> {
    return apiClient.get<ApiResponse<IJobAssignment[]>>(`api/jobAssignment`, {
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
}

export const JobAssignmentService = JobAssignmentServices;
