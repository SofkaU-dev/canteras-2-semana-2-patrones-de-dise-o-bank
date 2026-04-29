import { Injectable } from '@nestjs/common';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository.port';
import { ShipmentModel } from '../../domain/models/shipment.model';

@Injectable()
export class FindCustomerShipmentsUseCase {
  constructor(private readonly shipmentRepository: ShipmentRepositoryPort) {}

  async execute(customerId: string): Promise<ShipmentModel[]> {
    return this.shipmentRepository.findByCustomerId(customerId);
  }
}
