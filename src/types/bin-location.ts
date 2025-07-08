import { IWarehouseDropdown } from './warehouse';

export interface IBinLocation {
  _id: string;
  code: string;
  warehouse: IWarehouseDropdown;
  binSubLevel1: binSubLevel;
  binSubLevel2: binSubLevel;
  binSubLevel3: binSubLevel;
  binSubLevel4: binSubLevel;
  binSubLevel5: binSubLevel;
  capacity: number;
  itemGroup: string;
  itemCode: string;
  itemName: string;
  uom: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBinLocation {
  warehouse: string;
  binSubLevel1: string;
  binSubLevel2: string;
  binSubLevel3: string;
  binSubLevel4: string;
  binSubLevel5: string;
  capacity: number;
  itemGroup: string;
  itemCode: string;
  itemName: string;
  uom: string;
  isActive: boolean;
}

interface binSubLevel {
  _id: string;
  rows: {
    code: string;
    name: string;
  }[];
}
