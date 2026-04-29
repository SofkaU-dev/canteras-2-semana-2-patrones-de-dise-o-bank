import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { ShipmentRepositoryPort } from './domain/ports/shipment-repository.port';

// Application
import { CreateShipmentUseCase } from './application/use-cases/create-shipment.use-case';
import { FindShipmentUseCase } from './application/use-cases/find-shipment.use-case';
import { FindCustomerShipmentsUseCase } from './application/use-cases/find-customer-shipments.use-case';
import { UpdateShipmentStatusUseCase } from './application/use-cases/update-shipment-status.use-case';

// Strategies
import { StandardShippingStrategy } from './application/strategies/standard-shipping.strategy';
import { ExpressShippingStrategy } from './application/strategies/express-shipping.strategy';
import { InternationalShippingStrategy } from './application/strategies/international-shipping.strategy';
import { ThirdPartyShippingStrategy } from './application/strategies/third-party-shipping.strategy';

// Infrastructure
import { ShipmentController } from './infrastructure/controllers/shipment.controller';
import { ShipmentTypeormEntity } from './infrastructure/persistence/shipment.typeorm-entity';
import { ShipmentTypeormRepository } from './infrastructure/persistence/shipment.typeorm-repository';
import { ShipmentMapper } from './infrastructure/persistence/shipment.mapper';

// Other Modules
import { CustomersModule } from '../customers/customers.module';
import { EventsModule } from '../shared/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentTypeormEntity]),
    CustomersModule,
    EventsModule,
  ],
  controllers: [ShipmentController],
  providers: [
    ShipmentMapper,
    {
      provide: ShipmentRepositoryPort,
      useClass: ShipmentTypeormRepository,
    },
    // Strategies
    StandardShippingStrategy,
    ExpressShippingStrategy,
    InternationalShippingStrategy,
    ThirdPartyShippingStrategy,
    // Use Cases
    CreateShipmentUseCase,
    FindShipmentUseCase,
    FindCustomerShipmentsUseCase,
    UpdateShipmentStatusUseCase,
  ],
  exports: [ShipmentRepositoryPort],
})
export class ShipmentsModule {}
