import { Injectable } from '@nestjs/common';
import { TransferStrategyPort } from '../../domain/ports/transfer-strategy.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { InvalidTransferException } from '../../domain/exceptions/invalid-transfer.exception';

@Injectable()
export class OnlineTransferStrategy extends TransferStrategyPort {
  async validate(transfer: TransferModel): Promise<void> {
    if (transfer.sourceUserId === transfer.targetUserId) {
      throw new InvalidTransferException(
        'Source and target users must be different',
      );
    }
    if (transfer.amount <= 0) {
      throw new InvalidTransferException('Amount must be positive');
    }
  }

  calculateFee(amount: number): number {
    // Online transfers: 0.1% fee, minimum $0
    return Math.round(amount * 0.001 * 100) / 100;
  }

  async execute(transfer: TransferModel): Promise<TransferModel> {
    // Online transfers are instant
    return transfer.complete();
  }
}
