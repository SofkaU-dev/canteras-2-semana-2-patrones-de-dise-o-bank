import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserTypeormEntity } from './infrastructure/persistence/user.typeorm-entity';
import { UserTypeormRepository } from './infrastructure/persistence/user.typeorm-repository';
import { UserMapper } from './infrastructure/persistence/user.mapper';
import { UserController } from './infrastructure/controllers/user.controller';

import { UserRepositoryPort } from './domain/ports/user-repository.port';

import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeormEntity])],
  controllers: [UserController],
  providers: [
    // Infrastructure — Mapper
    UserMapper,

    // Infrastructure — Adapter (binds port → implementation)
    {
      provide: UserRepositoryPort,
      useClass: UserTypeormRepository,
    },

    // Application — Use Cases
    CreateUserUseCase,
    FindUserUseCase,
    FindAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersModule {}
