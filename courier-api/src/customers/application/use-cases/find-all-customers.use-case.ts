import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerModel } from '../../domain/models/customer.model';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(): Promise<CustomerModel[]> {
    return this.customerRepository.findAll();
  }
}
