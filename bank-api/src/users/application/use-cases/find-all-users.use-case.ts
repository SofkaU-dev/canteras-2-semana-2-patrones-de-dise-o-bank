import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserModel } from '../../domain/models/user.model';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toResponse(user));
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
