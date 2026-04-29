import { Injectable } from '@nestjs/common';
import { CustomerModel } from '../../domain/models/customer.model';
import { CustomerTypeormEntity } from './customer.typeorm-entity';

@Injectable()
export class CustomerMapper {
  toDomain(entity: CustomerTypeormEntity): CustomerModel {
    return new CustomerModel({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(model: CustomerModel): CustomerTypeormEntity {
    const entity = new CustomerTypeormEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.email = model.email;
    entity.password = model.password;
    entity.role = model.role;
    entity.isActive = model.isActive;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}
