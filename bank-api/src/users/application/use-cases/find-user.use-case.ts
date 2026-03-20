import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return this.toResponse(user);
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
