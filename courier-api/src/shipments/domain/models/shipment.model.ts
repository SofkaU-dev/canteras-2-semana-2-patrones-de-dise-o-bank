import { ShipmentStatus } from './shipment-status.enum';
import { ShipmentType } from './shipment-type.enum';

export class ShipmentModel {
  readonly id: string;
  readonly senderId: string;
  readonly recipientId: string;
  readonly declaredValue: number;
  readonly shippingCost: number;
  readonly type: ShipmentType;
  readonly status: ShipmentStatus;
  readonly metadata: Record<string, any>;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    senderId: string;
    recipientId: string;
    declaredValue: number;
    shippingCost: number;
    type: ShipmentType;
    status: ShipmentStatus;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.senderId = props.senderId;
    this.recipientId = props.recipientId;
    this.declaredValue = props.declaredValue;
    this.shippingCost = props.shippingCost;
    this.type = props.type;
    this.status = props.status;
    this.metadata = props.metadata || {};
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  complete(): ShipmentModel {
    return new ShipmentModel({
      ...this,
      status: ShipmentStatus.DELIVERED,
      updatedAt: new Date(),
    });
  }

  holdInCustoms(): ShipmentModel {
    return new ShipmentModel({
      ...this,
      status: ShipmentStatus.IN_CUSTOMS,
      updatedAt: new Date(),
    });
  }

  fail(): ShipmentModel {
    return new ShipmentModel({
      ...this,
      status: ShipmentStatus.FAILED,
      updatedAt: new Date(),
    });
  }

  updateStatus(status: ShipmentStatus): ShipmentModel {
    return new ShipmentModel({
      ...this,
      status,
      updatedAt: new Date(),
    });
  }
}
