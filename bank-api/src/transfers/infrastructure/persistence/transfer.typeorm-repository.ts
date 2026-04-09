import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferRepositoryPort } from '../../domain/ports/transfer-repository.port';
import { TransferModel } from '../../domain/models/transfer.model';
import { TransferTypeormEntity } from './transfer.typeorm-entity';
import { TransferMapper } from './transfer.mapper';

@Injectable()
export class TransferTypeormRepository implements TransferRepositoryPort {
  constructor(
    @InjectRepository(TransferTypeormEntity)
    private readonly repository: Repository<TransferTypeormEntity>,
    private readonly mapper: TransferMapper,
  ) {}

  async save(transfer: TransferModel): Promise<TransferModel> {
    const entity = this.mapper.toPersistence(transfer);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<TransferModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<TransferModel[]> {
    const entities = await this.repository.find({
      where: [{ source_user_id: userId }, { target_user_id: userId }],
      order: { created_at: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async update(transfer: TransferModel): Promise<TransferModel> {
    const entity = this.mapper.toPersistence(transfer);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }
}
