import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository.port';
import { ShipmentModel } from '../../domain/models/shipment.model';

@Injectable()
export class FindShipmentUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepositoryPort) {}

  async execute(id: string): Promise<ShipmentModel> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return shipment;
  }
}
