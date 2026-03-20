import { UserRole } from '../../domain/models/user.model';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
