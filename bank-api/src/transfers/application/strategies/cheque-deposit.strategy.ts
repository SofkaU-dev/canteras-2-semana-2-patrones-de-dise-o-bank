import { Injectable } from '@nestjs/common';
import { TransferStrategyPort } from '../../domain/ports/transfer-strategy.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { InvalidTransferException } from '../../domain/exceptions/invalid-transfer.exception';

@Injectable()
export class ChequeDepositStrategy extends TransferStrategyPort {
  private static readonly MAX_CHEQUE_AMOUNT = 50_000_000;

  async validate(transfer: TransferModel): Promise<void> {
    if (transfer.amount > ChequeDepositStrategy.MAX_CHEQUE_AMOUNT) {
      throw new InvalidTransferException(
        `Cheque amount cannot exceed $${ChequeDepositStrategy.MAX_CHEQUE_AMOUNT.toLocaleString()}`,
      );
    }
    if (!transfer.metadata?.chequeNumber) {
      throw new InvalidTransferException(
        'Cheque number is required for cheque deposits',
      );
    }
  }

  calculateFee(amount: number): number {
    // Cheque deposits: flat $1500 processing fee
    return 1500;
  }

  async execute(transfer: TransferModel): Promise<TransferModel> {
    // Cheques go through a clearing period — not instant
    return transfer.markClearing();
  }
}
