import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserModel } from '../../domain/models/user.model';
import { UserTypeormEntity } from './user.typeorm-entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserTypeormRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly repository: Repository<UserTypeormEntity>,
    private readonly mapper: UserMapper,
  ) {}

  async save(user: UserModel): Promise<UserModel> {
    const entity = this.mapper.toPersistence(user);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<UserModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<UserModel[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async update(user: UserModel): Promise<UserModel> {
    const entity = this.mapper.toPersistence(user);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
