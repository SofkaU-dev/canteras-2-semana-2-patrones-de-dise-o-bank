import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/models/user.model';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
