import { Injectable } from '@nestjs/common';
import { TransferRepositoryPort } from '../../domain/ports/transfer-repository.port';
import { TransferNotFoundException } from '../../domain/exceptions/transfer-not-found.exception';
import { TransferModel } from '../../domain/models/transfer.model';
import { TransferResponseDto } from '../dtos/transfer-response.dto';

@Injectable()
export class FindTransferUseCase {
  constructor(private readonly transferRepository: TransferRepositoryPort) {}

  async execute(id: string): Promise<TransferResponseDto> {
    const transfer = await this.transferRepository.findById(id);
    if (!transfer) {
      throw new TransferNotFoundException(id);
    }
    return this.toResponse(transfer);
  }

  private toResponse(t: TransferModel): TransferResponseDto {
    return {
      id: t.id,
      sourceUserId: t.sourceUserId,
      targetUserId: t.targetUserId,
      amount: t.amount,
      fee: t.fee,
      totalDebit: t.totalDebit,
      type: t.type,
      status: t.status,
      metadata: t.metadata,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}
