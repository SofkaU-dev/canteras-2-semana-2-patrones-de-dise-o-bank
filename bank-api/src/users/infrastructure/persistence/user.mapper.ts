import { Injectable } from '@nestjs/common';
import { UserModel, UserRole } from '../../domain/models/user.model';
import { UserTypeormEntity } from './user.typeorm-entity';

@Injectable()
export class UserMapper {
  toDomain(entity: UserTypeormEntity): UserModel {
    return new UserModel({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role as UserRole,
      isActive: entity.is_active,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  toPersistence(model: UserModel): UserTypeormEntity {
    const entity = new UserTypeormEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.email = model.email;
    entity.password = model.password;
    entity.role = model.role;
    entity.is_active = model.isActive;
    entity.created_at = model.createdAt;
    entity.updated_at = model.updatedAt;
    return entity;
  }
}
