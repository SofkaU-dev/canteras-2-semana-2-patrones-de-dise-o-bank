import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain ports
import { TransferRepositoryPort } from './domain/ports/transfer-repository.port';
import { TransferType } from './domain/models/transfer-type.enum';
import { TransferStrategyPort } from './domain/ports/transfer-strategy.port';

// Infrastructure
import { TransferTypeormEntity } from './infrastructure/persistence/transfer.typeorm-entity';
import { TransferTypeormRepository } from './infrastructure/persistence/transfer.typeorm-repository';
import { TransferMapper } from './infrastructure/persistence/transfer.mapper';
import { TransferController } from './infrastructure/controllers/transfer.controller';

// Strategies
import { OnlineTransferStrategy } from './application/strategies/online-transfer.strategy';
import { ChequeDepositStrategy } from './application/strategies/cheque-deposit.strategy';
import { AtmTransferStrategy } from './application/strategies/atm-transfer.strategy';
import { ThirdPartyTransferStrategy } from './application/strategies/third-party-transfer.strategy';

// Use cases
import { ExecuteTransferUseCase } from './application/use-cases/execute-transfer.use-case';
import { FindTransferUseCase } from './application/use-cases/find-transfer.use-case';
import { FindUserTransfersUseCase } from './application/use-cases/find-user-transfers.use-case';

// Shared (imported from parent module)
import { UserRepositoryPort } from '../users/domain/ports/user-repository.port';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../shared/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransferTypeormEntity]),
    UsersModule,
    EventsModule,
  ],
  controllers: [TransferController],
  providers: [
    // Infrastructure — Mapper
    TransferMapper,

    // Infrastructure — Repository Adapter (port → implementation)
    {
      provide: TransferRepositoryPort,
      useClass: TransferTypeormRepository,
    },

    // Strategy implementations (each one is a concrete strategy)
    OnlineTransferStrategy,
    ChequeDepositStrategy,
    AtmTransferStrategy,
    ThirdPartyTransferStrategy,

    // Strategy Map — Factory that assembles all strategies into a Map<TransferType, Strategy>
    {
      provide: 'TRANSFER_STRATEGIES',
      useFactory: (
        online: OnlineTransferStrategy,
        cheque: ChequeDepositStrategy,
        atm: AtmTransferStrategy,
        thirdParty: ThirdPartyTransferStrategy,
      ): Map<TransferType, TransferStrategyPort> =>
        new Map([
          [TransferType.ONLINE, online],
          [TransferType.CHEQUE, cheque],
          [TransferType.ATM, atm],
          [TransferType.THIRD_PARTY, thirdParty],
        ]),
      inject: [
        OnlineTransferStrategy,
        ChequeDepositStrategy,
        AtmTransferStrategy,
        ThirdPartyTransferStrategy,
      ],
    },

    // Application — Use Cases
    ExecuteTransferUseCase,
    FindTransferUseCase,
    FindUserTransfersUseCase,
  ],
})
export class TransfersModule {}
