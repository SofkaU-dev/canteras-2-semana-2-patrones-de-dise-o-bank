import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { CustomerRepositoryPort } from './domain/ports/customer-repository.port';

// Application
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindAllCustomersUseCase } from './application/use-cases/find-all-customers.use-case';
import { FindCustomerUseCase } from './application/use-cases/find-customer.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';

// Infrastructure
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { CustomerTypeormEntity } from './infrastructure/persistence/customer.typeorm-entity';
import { CustomerTypeormRepository } from './infrastructure/persistence/customer.typeorm-repository';
import { CustomerMapper } from './infrastructure/persistence/customer.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeormEntity])],
  controllers: [CustomerController],
  providers: [
    CustomerMapper,
    {
      provide: CustomerRepositoryPort,
      useClass: CustomerTypeormRepository,
    },
    CreateCustomerUseCase,
    FindAllCustomersUseCase,
    FindCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [CustomerRepositoryPort],
})
export class CustomersModule {}
