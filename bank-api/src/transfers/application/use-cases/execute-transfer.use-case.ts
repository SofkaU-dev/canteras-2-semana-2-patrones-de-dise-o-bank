import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TransferRepositoryPort } from '../../domain/ports/transfer-repository.port';
import { TransferStrategyPort } from '../../domain/ports/transfer-strategy.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { TransferStatus } from '../../domain/models/transfer-status.enum';
import { TransferType } from '../../domain/models/transfer-type.enum';
import { InvalidTransferException } from '../../domain/exceptions/invalid-transfer.exception';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { UserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { CreateTransferDto } from '../dtos/create-transfer.dto';
import { TransferResponseDto } from '../dtos/transfer-response.dto';

@Injectable()
export class ExecuteTransferUseCase {
  constructor(
    private readonly transferRepository: TransferRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    @Inject('TRANSFER_STRATEGIES')
    private readonly strategies: Map<TransferType, TransferStrategyPort>,
  ) {}

  async execute(dto: CreateTransferDto): Promise<TransferResponseDto> {
    // 1. Select the strategy based on transfer type
    const strategy = this.strategies.get(dto.type);
    if (!strategy) {
      throw new InvalidTransferException(
        `Unsupported transfer type: ${dto.type}`,
      );
    }

    // 2. Validate that both users exist and are active
    const [sourceUser, targetUser] = await Promise.all([
      this.userRepository.findById(dto.sourceUserId),
      this.userRepository.findById(dto.targetUserId),
    ]);

    if (!sourceUser || !sourceUser.isActive) {
      throw new InvalidTransferException('Source user not found or inactive');
    }
    if (!targetUser || !targetUser.isActive) {
      throw new InvalidTransferException('Target user not found or inactive');
    }

    // 3. Calculate fee using the strategy
    const fee = strategy.calculateFee(dto.amount);
    const now = new Date();

    // 4. Build transfer domain model
    const transfer = new TransferModel({
      id: uuidv4(),
      sourceUserId: dto.sourceUserId,
      targetUserId: dto.targetUserId,
      amount: dto.amount,
      fee,
      type: dto.type,
      status: TransferStatus.PENDING,
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });

    // 5. Validate strategy-specific rules
    await strategy.validate(transfer);

    // 6. Execute the transfer through the strategy
    const executed = await strategy.execute(transfer);

    // 7. Persist the result
    const saved = await this.transferRepository.save(executed);

    // 8. Publish event (Observer via Kafka)
    const eventTopic =
      saved.status === TransferStatus.COMPLETED
        ? 'transfer.completed'
        : saved.status === TransferStatus.CLEARING
          ? 'transfer.clearing'
          : 'transfer.failed';

    await this.eventPublisher.publish(eventTopic, {
      transferId: saved.id,
      sourceUserId: saved.sourceUserId,
      targetUserId: saved.targetUserId,
      amount: saved.amount,
      fee: saved.fee,
      type: saved.type,
      status: saved.status,
      timestamp: saved.updatedAt.toISOString(),
    });

    return this.toResponse(saved);
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
