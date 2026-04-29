import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ThirdPartyShippingStrategy extends ShippingStrategyPort {
  async validate(shipment: ShipmentModel): Promise<void> {
    if (shipment.senderId === shipment.recipientId) {
      throw new BadRequestException('Sender and recipient must be different');
    }
    const { carrierName, externalTrackingId } = shipment.metadata || {};
    if (!carrierName || !externalTrackingId) {
      throw new BadRequestException(
        'Third party shipping requires carrierName and externalTrackingId',
      );
    }
    if (shipment.declaredValue <= 0) {
      throw new BadRequestException('Declared value must be positive');
    }
  }

  calculateCost(declaredValue: number): number {
    return declaredValue * 0.05;
  }

  async execute(shipment: ShipmentModel): Promise<ShipmentModel> {
    return shipment.complete();
  }
}
