import { TransferModel } from '../models/transfer.model';

export abstract class TransferStrategyPort {
  /** Validate business rules specific to this strategy */
  abstract validate(transfer: TransferModel): Promise<void>;

  /** Calculate the fee for this strategy */
  abstract calculateFee(amount: number): number;

  /** Execute the transfer using this strategy's logic, return the resulting status */
  abstract execute(transfer: TransferModel): Promise<TransferModel>;
}
