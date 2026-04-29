import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentTypeormEntity } from './shipment.typeorm-entity';
import { ShipmentMapper } from './shipment.mapper';

@Injectable()
export class ShipmentTypeormRepository implements ShipmentRepositoryPort {
  constructor(
    @InjectRepository(ShipmentTypeormEntity)
    private readonly repository: Repository<ShipmentTypeormEntity>,
    private readonly mapper: ShipmentMapper,
  ) {}

  async save(shipment: ShipmentModel): Promise<ShipmentModel> {
    const entity = this.mapper.toPersistence(shipment);
    const savedEntity = await this.repository.save(entity);
    return this.mapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<ShipmentModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<ShipmentModel[]> {
    const entities = await this.repository.find({
      where: [{ senderId: customerId }, { recipientId: customerId }],
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
