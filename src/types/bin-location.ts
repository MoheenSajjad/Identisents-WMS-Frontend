import { ISAPItemGroup } from '@/components/parts/dropdowns/sap-item-group-dropdown';
import { IWarehouseDropdown } from './warehouse';
import { ISAPItem } from '@/components/parts/dropdowns/sap-items-dropdown';

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
  itemGroupCode: string;
  itemCode?: string;
  itemName?: string;
  uom: string;
  isActive: boolean;
  isDeleted: boolean;
  canUpdate: boolean;
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

export interface IUpdateBinLocation {
  itemGroup: string;
  itemGroupCode: string;
  itemCode: string;
  itemName: string;
  uom: string;
  capacity: number;
  isActive: boolean;
}

export interface IGenerateBinLocationCodesProps {
  warehouse: string;
  fromBinSubLevel1: string;
  fromBinSubLevel2: string;
  fromBinSubLevel3: string;
  fromBinSubLevel4: string;
  toBinSubLevel1: string;
  toBinSubLevel2: string;
  toBinSubLevel3: string;
  toBinSubLevel4: string;
  capacity: number;
  itemGroup: ISAPItemGroup;
  itemName: ISAPItem;
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
