import { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Package, MapPin, ArrowLeftCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTransition } from '@/components/parts/animations';
import { ReloadButton } from '@/components/parts/Buttons';
import Card from '@/components/parts/card/Card';
import { Button } from '@/components/ui/Button';
import { Empty } from '@/components/ui/Empty';
import { Loading } from '@/components/ui/Loading';
import { Paper } from '@/components/ui/Paper';
import { useFetch } from '@/hooks/use-fetch/use-fetch';
import { JobAssignmentService } from '@/services/job-assignment-service';
import { ApiResponse } from '@/types/api';
import { formatDate } from '@/utils/helpers';

// Interfaces
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
  createdAt: string;
  updatedAt: string;
  __v: number;
  transactions: Transaction[];
}

export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchJobAssignmentDetail = useCallback(
    (signal: AbortSignal) => JobAssignmentService.getById(id!, signal),
    [id]
  );

  const { data, isLoading, refetch } =
    useFetch<ApiResponse<IJobAssignmentDetail>>(fetchJobAssignmentDetail);

  const job = data?.data;

  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(
    new Set([job?.transactions[0]?._id ?? ''])
  );
  const [expandedLineItems, setExpandedLineItems] = useState<Set<string>>(new Set());
  const [expandedBinLocations, setExpandedBinLocations] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string, type: 'transaction' | 'lineItem' | 'binLocation') => {
    const setFunction =
      type === 'transaction'
        ? setExpandedTransactions
        : type === 'lineItem'
          ? setExpandedLineItems
          : setExpandedBinLocations;

    setFunction(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <PageTransition>
      <Paper>
        <Paper.BigTitle title="Job Detail">
          <div className="space-x-2">
            <ReloadButton onClick={refetch} />
            <Button
              variant={Button.Variant.PRIMARY}
              icon={<ArrowLeftCircle />}
              onClick={() => navigate('/jobs')}
            >
              Back
            </Button>
          </div>
        </Paper.BigTitle>
        <Card className="border border-gray-300">
          <Loading isLoading={isLoading}>
            {job ? (
              <>
                <div className="rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Document Number</label>
                      <div className="text-lg font-semibold text-gray-900">{job.docNum}</div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Object Type</label>
                      <div className="text-lg font-semibold text-gray-900">{job.objType}</div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Document Date</label>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDate(job.docDate)}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Company ID</label>
                      <div className="text-lg font-semibold text-gray-900">{job.companyId}</div>
                    </div>
                  </div>
                </div>

                {job.transactions?.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Transaction Logs</h2>

                    {job.transactions.map((transaction, transactionIndex) => (
                      <div
                        key={transaction._id}
                        className="rounded-lg border border-gray-200 bg-white"
                      >
                        {/* Transaction Header */}
                        <div
                          className="flex cursor-pointer items-center justify-between border-b border-gray-200 p-4 hover:bg-gray-50"
                          onClick={() => toggleExpanded(transaction._id, 'transaction')}
                        >
                          <div className="flex items-center gap-3">
                            {expandedTransactions.has(transaction._id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                Transaction {transactionIndex + 1}
                              </div>
                              <div className="text-sm text-gray-600">
                                {transaction.bpName} • {formatDate(transaction.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{transaction.bpCode}</div>
                        </div>

                        {/* Transaction Content */}
                        {expandedTransactions.has(transaction._id) && (
                          <div className="space-y-4 p-4">
                            {transaction.lineItems.map(lineItem => (
                              <div key={lineItem._id} className="rounded border border-gray-200">
                                {/* Line Item Header */}
                                <div
                                  className="flex cursor-pointer items-center justify-between border-b border-gray-100 p-3 hover:bg-gray-50"
                                  onClick={() => toggleExpanded(lineItem._id, 'lineItem')}
                                >
                                  <div className="flex items-center gap-3">
                                    {expandedLineItems.has(lineItem._id) ? (
                                      <ChevronDown className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-gray-500" />
                                    )}
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {lineItem.itemName}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {lineItem.itemCode}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-900">
                                      {lineItem.quantity} {lineItem.uom}
                                    </div>
                                    <div className="text-xs text-gray-500">Total</div>
                                  </div>
                                </div>

                                {/* Line Item Content */}
                                {expandedLineItems.has(lineItem._id) && (
                                  <div className="space-y-3 p-3">
                                    {/* Quantity Summary */}
                                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                      <div>
                                        <div className="text-gray-600">Warehouse</div>
                                        <div className="font-medium">
                                          {lineItem.warehouse.name} ({lineItem.warehouse.code})
                                        </div>
                                      </div>
                                      {lineItem.fromWarehouse && (
                                        <div>
                                          <div className="text-gray-600">From Warehouse</div>
                                          <div className="font-medium">
                                            {lineItem.fromWarehouse.name} (
                                            {lineItem.fromWarehouse.code})
                                          </div>
                                        </div>
                                      )}
                                      <div>
                                        <div className="text-gray-600">Total Qty</div>
                                        <div className="font-medium">{lineItem.quantity}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-600">Received</div>
                                        <div className="font-medium text-green-600">
                                          {lineItem.receivedQuantity}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-gray-600">Open</div>
                                        <div className="font-medium text-amber-600">
                                          {lineItem.openQuantity}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Bin Locations */}
                                    {lineItem.binLocations.map(binLocation => (
                                      <div
                                        key={binLocation._id}
                                        className="rounded border border-gray-100"
                                      >
                                        <div
                                          className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-50"
                                          onClick={() =>
                                            toggleExpanded(binLocation._id, 'binLocation')
                                          }
                                        >
                                          <div className="flex items-center gap-2">
                                            {expandedBinLocations.has(binLocation._id) ? (
                                              <ChevronDown className="h-4 w-4 text-gray-500" />
                                            ) : (
                                              <ChevronRight className="h-4 w-4 text-gray-500" />
                                            )}
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium">
                                              {binLocation.binLocationId.code}
                                            </span>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Qty: {binLocation.quantity}
                                          </div>
                                        </div>

                                        {expandedBinLocations.has(binLocation._id) && (
                                          <div className="border-t border-gray-100 p-2">
                                            <div className="mb-2 text-xs text-gray-600">
                                              Item Group: {binLocation.binLocationId.itemGroup}
                                            </div>

                                            {/* Batches */}
                                            <div className="space-y-2">
                                              {binLocation.batches.map(batch => (
                                                <div
                                                  key={batch._id}
                                                  className="rounded bg-gray-50 p-2 text-xs"
                                                >
                                                  <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                                                    <div>
                                                      <div className="text-gray-600">Batch</div>
                                                      <div className="font-medium">
                                                        {batch.BatchNumber}
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="text-gray-600">Pack Size</div>
                                                      <div className="font-medium">
                                                        {batch.packSize}
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="text-gray-600">Pack/Qty</div>
                                                      <div className="font-medium">
                                                        {batch.packPerQuantity}
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="text-gray-600">Total</div>
                                                      <div className="font-medium text-green-600">
                                                        {batch.totalQuantity}
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="text-gray-600">
                                                        Vendor Lot
                                                      </div>
                                                      <div className="font-medium">
                                                        {batch.vendorLotNumber}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Empty />
            )}
          </Loading>
        </Card>
      </Paper>
    </PageTransition>
  );
};
