import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    const updated = new UserModel({
      id: user.id,
      name: dto.name ?? user.name,
      email: user.email,
      password: user.password,
      role: dto.role ?? user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    });

    const saved = await this.userRepository.update(updated);
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
