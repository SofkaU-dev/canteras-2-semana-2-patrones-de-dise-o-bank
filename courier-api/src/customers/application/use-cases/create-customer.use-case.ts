import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository.port';
import { CustomerModel } from '../../domain/models/customer.model';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerModel> {
    const existingCustomer = await this.customerRepository.findByEmail(dto.email);
    if (existingCustomer) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer = new CustomerModel({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.customerRepository.save(customer);
  }
}
