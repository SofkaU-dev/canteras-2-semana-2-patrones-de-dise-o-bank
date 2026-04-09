import { BadRequestException } from '@nestjs/common';

export class InvalidTransferException extends BadRequestException {
  constructor(message: string) {
    super(`Invalid transfer: ${message}`);
  }
}
