import { TransferType } from '../../domain/models/transfer-type.enum';
import { TransferStatus } from '../../domain/models/transfer-status.enum';

export class TransferResponseDto {
  id: string;
  sourceUserId: string;
  targetUserId: string;
  amount: number;
  fee: number;
  totalDebit: number;
  type: TransferType;
  status: TransferStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
