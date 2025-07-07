export interface IWarehouse {
  _id: string;
  code: string;
  name: string;
  companyId: string;
  sapWarehouses: string[];
  isBinLocationEnabled: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ISAPWarehouses {
  WarehouseCode: string;
  WarehouseName: string;
}

export interface IWarehouseUpdate {
  name: string;
  companyId: string;
  sapWarehouses: string[];
  isBinLocationEnabled: boolean;
  isActive: boolean;
}
