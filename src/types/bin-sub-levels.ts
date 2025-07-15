export interface IBinSubLevels {
  _id: string;
  level: number;
  name: string;
  rows: IBinSubLevelRows[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IAllBinSubLevels = Omit<IBinSubLevels, 'createdAt' | 'updatedAt' | 'isDeleted'>;

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
  'createdAt' | 'updatedAt' | '_id' | 'isDeleted'
> & {
  name: string;
};

export interface ISubLevelDropdown {
  _id: string;
  subLevel: number;
  name: string;
}
