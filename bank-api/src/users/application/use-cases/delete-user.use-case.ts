import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    const deactivated = user.deactivate();
    await this.userRepository.update(deactivated);
  }
}
