import { Injectable } from '@nestjs/common';
import { TransferModel } from '../../domain/models/transfer.model';
import { TransferType } from '../../domain/models/transfer-type.enum';
import { TransferStatus } from '../../domain/models/transfer-status.enum';
import { TransferTypeormEntity } from './transfer.typeorm-entity';

@Injectable()
export class TransferMapper {
  toDomain(entity: TransferTypeormEntity): TransferModel {
    return new TransferModel({
      id: entity.id,
      sourceUserId: entity.source_user_id,
      targetUserId: entity.target_user_id,
      amount: Number(entity.amount),
      fee: Number(entity.fee),
      type: entity.type as TransferType,
      status: entity.status as TransferStatus,
      metadata: entity.metadata,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  toPersistence(model: TransferModel): TransferTypeormEntity {
    const entity = new TransferTypeormEntity();
    entity.id = model.id;
    entity.source_user_id = model.sourceUserId;
    entity.target_user_id = model.targetUserId;
    entity.amount = model.amount;
    entity.fee = model.fee;
    entity.type = model.type;
    entity.status = model.status;
    entity.metadata = model.metadata;
    entity.created_at = model.createdAt;
    entity.updated_at = model.updatedAt;
    return entity;
  }
}
