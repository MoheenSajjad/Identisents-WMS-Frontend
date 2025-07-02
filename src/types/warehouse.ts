export interface IWarehouse {
  _id: string;
  code: string;
  name: string;
  sapWarehouses: string[];
  isBinLocationEnabled: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
