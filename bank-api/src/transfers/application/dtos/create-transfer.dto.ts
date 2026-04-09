import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { TransferType } from '../../domain/models/transfer-type.enum';

export class CreateTransferDto {
  @IsUUID()
  @IsNotEmpty()
  sourceUserId: string;

  @IsUUID()
  @IsNotEmpty()
  targetUserId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransferType)
  type: TransferType;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
