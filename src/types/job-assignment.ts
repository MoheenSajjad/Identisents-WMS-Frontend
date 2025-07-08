export interface IJobAssignment {
  _id: string;
  objType: ObjectType;
  docNum: string;
  docEntry: number;
  docDate: string;
  docStatus: string;
  companyId: string;
  status: string;
  isActive: boolean;
  isDeleted: false;
  createdAt: string;
  updatedAt: string;
}

export enum ObjectType {
  STOCK_INWARD = 'Stock Inward',
  STOCK_OUTWARD = 'Outbound Transfer',
  DELIVERY = 'Delivery',
  STOCK_TRANSFER = 'Stock Transfer',
  STOCK_COUNTING = 'Stock Counting',
}
