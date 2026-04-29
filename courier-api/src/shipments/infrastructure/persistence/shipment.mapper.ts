import { Injectable } from '@nestjs/common';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentTypeormEntity } from './shipment.typeorm-entity';

@Injectable()
export class ShipmentMapper {
  toDomain(entity: ShipmentTypeormEntity): ShipmentModel {
    return new ShipmentModel({
      id: entity.id,
      senderId: entity.senderId,
      recipientId: entity.recipientId,
      declaredValue: Number(entity.declaredValue),
      shippingCost: Number(entity.shippingCost),
      type: entity.type,
      status: entity.status,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(model: ShipmentModel): ShipmentTypeormEntity {
    const entity = new ShipmentTypeormEntity();
    entity.id = model.id;
    entity.senderId = model.senderId;
    entity.recipientId = model.recipientId;
    entity.declaredValue = model.declaredValue;
    entity.shippingCost = model.shippingCost;
    entity.type = model.type;
    entity.status = model.status;
    entity.metadata = model.metadata;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}
