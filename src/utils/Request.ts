// import { ApiResponse } from "@/types/api";
// import { apiClient } from "./apiClient";

// interface GetAllOptions {
//   entity: string;
//   options?: Record<string, any>; // `options` is an object where keys are strings and values can be of any type
// }

// export const request = {
//   create: async <T = unknown>({
//     entity,
//     jsonData,
//   }: {
//     entity: string;
//     jsonData: T | {};
//   }): Promise<ApiResponse> => {
//     return await apiClient({
//       method: 'post',
//       url: entity,
//       data: jsonData,
//     });
//   },

//   post: async ({
//     entity,
//     jsonData,
//   }: {
//     entity: string;
//     jsonData?: any;
//   }): Promise<ServiceOutput> => {
//     return await apiClient({
//       method: 'post',
//       url: entity,
//       data: jsonData,
//     });
//   },

//   read: async ({ entity, id }: { entity: string; id?: string }) => {
//     const response: ServiceOutput = await apiClient({
//       method: 'get',
//       url: `${entity}/${id}`,
//     });

//     return response;
//   },

//   get: async ({ entity }: { entity: string }): Promise<ServiceOutput> => {
//     const response: ServiceOutput = await apiClient({
//       method: 'get',
//       url: `${entity}`,
//     });

//     return response;
//   },

//   getAll: async ({ entity, options = {} }: GetAllOptions): Promise<ServiceOutput> => {
//     try {
//       let query = '?';
//       for (const key in options) {
//         if (!options[key]) continue;
//         query += `${key}=${options[key]}&`;
//       }
//       query = query.slice(0, -1);

//       const response: ServiceOutput = await apiClient.get(`${entity}${query}`);

//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   donwloadFile: async ({ entity }: { entity: string }) => {
//     const response = await apiClient({
//       method: 'get',
//       url: `${entity}`,
//       responseType: 'blob',
//       headers: {
//         Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       },
//     });

//     return response;
//   },

//   downloadFileWithPost: async ({ entity, jsonData }: { entity: string; jsonData?: any }) => {
//     const response = await apiClient({
//       method: 'post',
//       url: entity,
//       data: jsonData,
//       responseType: 'blob',
//     });

//     return response;
//   },

//   UploadFile: async ({ entity, file }: { entity: string; file?: any }): Promise<ServiceOutput> => {
//     const response: ServiceOutput = await apiClient({
//       method: 'post',
//       url: entity,
//       data: file,
//     });

//     return response;
//   },

//   delete: async ({
//     entity,
//     id,
//     isDeleted,
//   }: {
//     entity: string;
//     id: number;
//     isDeleted: boolean;
//   }): Promise<ServiceOutput> => {
//     try {
//       const response: ServiceOutput = await apiClient.post(
//         entity + '?Id=' + id + '&isDeleted=' + isDeleted
//       );

//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   filter: async ({ entity, options = {} }: GetAllOptions) => {
//     try {
//       let queryParams = [];

//       if (options.Filters && Array.isArray(options.Filters)) {
//         options.Filters.forEach(filter => {
//           if (filter.id && filter.value !== undefined && filter.operator) {
//             queryParams.push(`filter[${filter.id}]=${encodeURIComponent(filter.value)}`);
//             queryParams.push(
//               `filter[${filter.id}][operator]=${encodeURIComponent(filter.operator)}`
//             );
//           }
//         });
//       }

//       if (options.PageNumber !== undefined) {
//         queryParams.push(`pageNumber=${options.PageNumber}`);
//       }
//       if (options.PageSize !== undefined) {
//         queryParams.push(`pageSize=${options.PageSize}`);
//       }

//       const query = queryParams.length ? `?${queryParams.join('&')}` : '';
//       const response = await apiClient.get(`${entity}/filter${query}`);

//       return response.data;
//     } catch (error) {
//       return {
//         status: false,
//         responseCode: 404,
//         data: null,
//         message: 'Error occurred',
//       };
//     }
//   },
// };
