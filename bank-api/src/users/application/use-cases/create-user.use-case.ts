import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserModel, UserRole } from '../../domain/models/user.model';
import { EmailAlreadyExistsException } from '../../domain/exceptions/email-already-exists.exception';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const now = new Date();

    const user = new UserModel({
      id: uuidv4(),
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? UserRole.CLIENT,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.userRepository.save(user);
    return this.toResponse(saved);
  }

  private toResponse(user: UserModel): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
