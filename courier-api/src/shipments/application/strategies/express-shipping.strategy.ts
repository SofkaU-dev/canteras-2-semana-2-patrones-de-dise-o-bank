import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ExpressShippingStrategy extends ShippingStrategyPort {
  async validate(shipment: ShipmentModel): Promise<void> {
    if (shipment.senderId === shipment.recipientId) {
      throw new BadRequestException('Sender and recipient must be different');
    }
    const weight = shipment.metadata?.weightKg;
    if (weight === undefined || weight > 5) {
      throw new BadRequestException('Express shipping weight must be <= 5kg');
    }
    if (shipment.declaredValue > 3000000) {
      throw new BadRequestException('Express shipping declared value must be <= 3,000,000');
    }
    if (shipment.declaredValue <= 0) {
      throw new BadRequestException('Declared value must be positive');
    }
  }

  calculateCost(): number {
    return 15000;
  }

  async execute(shipment: ShipmentModel): Promise<ShipmentModel> {
    return shipment.complete();
  }
}
