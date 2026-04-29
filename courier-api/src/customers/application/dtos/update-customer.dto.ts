import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CustomerRole } from '../../domain/models/customer.model';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'John Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: CustomerRole, example: CustomerRole.ADMIN })
  @IsEnum(CustomerRole)
  @IsOptional()
  role?: CustomerRole;
}
