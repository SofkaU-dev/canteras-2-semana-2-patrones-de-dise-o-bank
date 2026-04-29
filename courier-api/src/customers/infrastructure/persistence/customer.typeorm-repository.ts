import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerModel } from '../../domain/models/customer.model';
import { CustomerTypeormEntity } from './customer.typeorm-entity';
import { CustomerMapper } from './customer.mapper';

@Injectable()
export class CustomerTypeormRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerTypeormEntity)
    private readonly repository: Repository<CustomerTypeormEntity>,
    private readonly mapper: CustomerMapper,
  ) {}

  async save(customer: CustomerModel): Promise<CustomerModel> {
    const entity = this.mapper.toPersistence(customer);
    const savedEntity = await this.repository.save(entity);
    return this.mapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<CustomerModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<CustomerModel | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<CustomerModel[]> {
    const entities = await this.repository.find({ where: { isActive: true } });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }
}
