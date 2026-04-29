import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerModel } from '../../domain/models/customer.model';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<CustomerModel> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    const updatedCustomer = customer.updateProfile(dto.name!, dto.role);
    return this.customerRepository.save(updatedCustomer);
  }
}
