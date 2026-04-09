import { TransferModel } from '../models/transfer.model';

export abstract class TransferRepositoryPort {
  abstract save(transfer: TransferModel): Promise<TransferModel>;
  abstract findById(id: string): Promise<TransferModel | null>;
  abstract findByUserId(userId: string): Promise<TransferModel[]>;
  abstract update(transfer: TransferModel): Promise<TransferModel>;
}
