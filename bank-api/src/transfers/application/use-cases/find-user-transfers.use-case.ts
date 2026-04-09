import { Injectable } from '@nestjs/common';
import { TransferRepositoryPort } from '../../domain/ports/transfer-repository.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { TransferResponseDto } from '../dtos/transfer-response.dto';

@Injectable()
export class FindUserTransfersUseCase {
  constructor(private readonly transferRepository: TransferRepositoryPort) {}

  async execute(userId: string): Promise<TransferResponseDto[]> {
    const transfers = await this.transferRepository.findByUserId(userId);
    return transfers.map((t) => this.toResponse(t));
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
