import { BadRequestException } from '@nestjs/common';

export class InvalidShipmentException extends BadRequestException {
  constructor(message: string) {
    super(`Invalid shipment: ${message}`);
  }
}
