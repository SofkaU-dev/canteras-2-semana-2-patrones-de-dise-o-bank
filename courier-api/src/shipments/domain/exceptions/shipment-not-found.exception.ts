import { NotFoundException } from '@nestjs/common';

export class ShipmentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Shipment with ID ${id} not found`);
  }
}
