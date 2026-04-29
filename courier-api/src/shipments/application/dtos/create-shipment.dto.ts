import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ShipmentType } from '../../domain/models/shipment-type.enum';

export class CreateShipmentDto {
  @ApiProperty({ example: 'uuid-v4-sender' })
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ example: 'uuid-v4-recipient' })
  @IsUUID()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(0.01)
  declaredValue: number;

  @ApiProperty({ enum: ShipmentType, example: ShipmentType.STANDARD })
  @IsEnum(ShipmentType)
  type: ShipmentType;

  @ApiProperty({
    example: { weightKg: 10, destinationCountry: 'USA', customsDeclaration: 'Gift' },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
