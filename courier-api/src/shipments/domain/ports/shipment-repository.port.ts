import { ShipmentModel } from '../models/shipment.model';

export abstract class ShipmentRepositoryPort {
  abstract save(shipment: ShipmentModel): Promise<ShipmentModel>;
  abstract findById(id: string): Promise<ShipmentModel | null>;
  abstract findByCustomerId(customerId: string): Promise<ShipmentModel[]>;
}
