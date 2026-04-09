import { Injectable } from '@nestjs/common';
import { TransferStrategyPort } from '../../domain/ports/transfer-strategy.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { InvalidTransferException } from '../../domain/exceptions/invalid-transfer.exception';

@Injectable()
export class ThirdPartyTransferStrategy extends TransferStrategyPort {
  async validate(transfer: TransferModel): Promise<void> {
    if (!transfer.metadata?.providerName) {
      throw new InvalidTransferException(
        'Provider name is required for third-party transfers',
      );
    }
    if (!transfer.metadata?.providerTransactionId) {
      throw new InvalidTransferException(
        'Provider transaction ID is required for third-party transfers',
      );
    }
  }

  calculateFee(amount: number): number {
    // Third-party transfers: 1.5% intermediary commission
    return Math.round(amount * 0.015 * 100) / 100;
  }

  async execute(transfer: TransferModel): Promise<TransferModel> {
    // Third-party transfers are pending until the provider confirms
    return transfer.complete();
  }
}
