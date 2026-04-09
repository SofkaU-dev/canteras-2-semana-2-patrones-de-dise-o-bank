import { Injectable } from '@nestjs/common';
import { TransferStrategyPort } from '../../domain/ports/transfer-strategy.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { InvalidTransferException } from '../../domain/exceptions/invalid-transfer.exception';

@Injectable()
export class AtmTransferStrategy extends TransferStrategyPort {
  private static readonly DAILY_LIMIT = 3_000_000;

  async validate(transfer: TransferModel): Promise<void> {
    if (transfer.amount > AtmTransferStrategy.DAILY_LIMIT) {
      throw new InvalidTransferException(
        `ATM transfers cannot exceed $${AtmTransferStrategy.DAILY_LIMIT.toLocaleString()} per transaction`,
      );
    }
    if (transfer.sourceUserId === transfer.targetUserId) {
      throw new InvalidTransferException(
        'Source and target users must be different',
      );
    }
  }

  calculateFee(amount: number): number {
    // ATM transfers: flat $2500 network fee
    return 2500;
  }

  async execute(transfer: TransferModel): Promise<TransferModel> {
    // ATM transfers complete instantly after validation
    return transfer.complete();
  }
}
