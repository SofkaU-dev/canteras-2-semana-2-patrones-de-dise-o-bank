import { TransferType } from './transfer-type.enum';
import { TransferStatus } from './transfer-status.enum';

export class TransferModel {
  readonly id: string;
  readonly sourceUserId: string;
  readonly targetUserId: string;
  readonly amount: number;
  readonly fee: number;
  readonly type: TransferType;
  readonly status: TransferStatus;
  readonly metadata: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    sourceUserId: string;
    targetUserId: string;
    amount: number;
    fee: number;
    type: TransferType;
    status: TransferStatus;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.sourceUserId = props.sourceUserId;
    this.targetUserId = props.targetUserId;
    this.amount = props.amount;
    this.fee = props.fee;
    this.type = props.type;
    this.status = props.status;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get totalDebit(): number {
    return this.amount + this.fee;
  }

  complete(): TransferModel {
    return new TransferModel({
      ...this,
      status: TransferStatus.COMPLETED,
      updatedAt: new Date(),
    });
  }

  fail(): TransferModel {
    return new TransferModel({
      ...this,
      status: TransferStatus.FAILED,
      updatedAt: new Date(),
    });
  }

  markClearing(): TransferModel {
    return new TransferModel({
      ...this,
      status: TransferStatus.CLEARING,
      updatedAt: new Date(),
    });
  }
}
