import { Injectable } from '@nestjs/common';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class StandardShippingStrategy extends ShippingStrategyPort {
  async validate(shipment: ShipmentModel): Promise<void> {
    if (shipment.senderId === shipment.recipientId) {
      throw new BadRequestException('Sender and recipient must be different');
    }
    const weight = shipment.metadata?.weightKg;
    if (weight === undefined || weight > 20) {
      throw new BadRequestException('Standard shipping weight must be <= 20kg');
    }
    if (shipment.declaredValue <= 0) {
      throw new BadRequestException('Declared value must be positive');
    }
  }

  calculateCost(declaredValue: number): number {
    const cost = declaredValue * 0.001;
    return Math.max(cost, 5000);
  }

  async execute(shipment: ShipmentModel): Promise<ShipmentModel> {
    return shipment.complete();
  }
}
