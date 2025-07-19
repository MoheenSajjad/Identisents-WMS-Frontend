export interface IJobAssignment {
  _id: string;
  objType: ObjectType;
  docNum: string;
  docEntry: number;
  docDate: string;
  docStatus: DocStatus;
  companyId: string;
  status: JobStatus;
  isActive: boolean;
  isDeleted: false;
  sapStatus: SapStatus;
  sapError?: string;
  sapAttemptedAt?: string;
  createdAt: string;
  updatedAt: string;
  employeeId: {
    _id: string;
    employeeCode: string;
    employeeName: string;
  };
}

export enum ObjectType {
  STOCK_INWARD = 'Stock Inward',
  STOCK_OUTWARD = 'Outbound Transfer',
  DELIVERY = 'Delivery',
  STOCK_TRANSFER = 'Stock Transfer',
  STOCK_COUNTING = 'Stock Counting',
}

export enum JobStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Not Started',
  IN_PROCESS = 'In Process',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
}

export enum DocStatus {
  CLOSES = 'Closed',
  OPEN = 'Open',
  CANCELED = 'Canceled',
}

export enum SapStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface Batch {
  BatchNumber: string;
  packSize: number;
  packPerQuantity: number;
  totalQuantity: number;
  vendorLotNumber: string;
  _id: string;
}

export interface BinLocationId {
  _id: string;
  code: string;
  itemGroup: string;
}

export interface BinLocation {
  binLocationId: BinLocationId;
  quantity: number;
  direction: string;
  batches: Batch[];
  _id: string;
}

export interface Warehouse {
  _id: string;
  code: string;
  name: string;
}

export interface LineItem {
  itemCode: string;
  itemName: string;
  uom: string;
  quantity: number;
  warehouse: Warehouse;
  fromWarehouse?: Warehouse;
  receivedQuantity: number;
  openQuantity: number;
  binLocations: BinLocation[];
  _id: string;
}

export interface Transaction {
  _id: string;
  jobId: string;
  objType: string;
  docNum: string;
  docEntry: number;
  docDate: string;
  bpCode: string;
  bpName: string;
  bpRefNum: string;
  lineItems: LineItem[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IJobAssignmentDetail {
  _id: string;
  objType: string;
  docNum: string;
  docEntry: number;
  docDate: string;
  docStatus: string;
  companyId: string;
  status: string;
  isActive: boolean;
  isDeleted: boolean;
  sapStatus: SapStatus;
  sapError?: string;
  sapAttemptedAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  transactions: Transaction[];
  document?: any;
}
