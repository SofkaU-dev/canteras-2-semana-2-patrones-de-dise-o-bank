import { NotFoundException } from '@nestjs/common';

export class TransferNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Transfer with id "${id}" not found`);
  }
}
