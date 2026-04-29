import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class InternationalShippingStrategy extends ShippingStrategyPort {
  async validate(shipment: ShipmentModel): Promise<void> {
    if (shipment.senderId === shipment.recipientId) {
      throw new BadRequestException('Sender and recipient must be different');
    }
    const { destinationCountry, customsDeclaration } = shipment.metadata || {};
    if (!destinationCountry || !customsDeclaration) {
      throw new BadRequestException(
        'International shipping requires destinationCountry and customsDeclaration',
      );
    }
    if (shipment.declaredValue > 50000000) {
      throw new BadRequestException(
        'International shipping declared value must be <= 50,000,000',
      );
    }
    if (shipment.declaredValue <= 0) {
      throw new BadRequestException('Declared value must be positive');
    }
  }

  calculateCost(declaredValue: number): number {
    return 50000 + declaredValue * 0.02;
  }

  async execute(shipment: ShipmentModel): Promise<ShipmentModel> {
    return shipment.holdInCustoms();
  }
}
