import { ShipmentModel } from '../models/shipment.model';

export abstract class ShippingStrategyPort {
  abstract validate(shipment: ShipmentModel): Promise<void>;
  abstract calculateCost(declaredValue: number, metadata?: Record<string, any>): number;
  abstract execute(shipment: ShipmentModel): Promise<ShipmentModel>;
}
