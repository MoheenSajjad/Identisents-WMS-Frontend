export interface IBinSubLevels {
  _id: string;
  binLocationSubLevel: IBinLocationSubLevel;
  rows: IBinSubLevelRows[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBinLocationSubLevel {
  _id: string;
  subLevel: number;
  name: string;
  isActive: boolean;
}

export interface IBinSubLevelRows {
  code: string;
  name: string;
  serialNumber?: number;
}

export type ICreateBinSubLevel = Omit<
  IBinSubLevels,
  'createdAt' | 'updatedAt' | '_id' | 'isDeleted' | 'binLocationSubLevel'
> & {
  binLocationSubLevel: string;
};

export interface ISubLevelDropdown {
  _id: string;
  subLevel: number;
  name: string;
}
