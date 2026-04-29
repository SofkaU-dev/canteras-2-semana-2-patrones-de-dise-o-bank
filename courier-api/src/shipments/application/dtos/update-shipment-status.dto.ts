import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ShipmentStatus } from '../../domain/models/shipment-status.enum';

export class UpdateShipmentStatusDto {
  @ApiProperty({
    enum: ShipmentStatus,
    description: 'The new status of the shipment',
    example: ShipmentStatus.DELIVERED,
  })
  @IsEnum(ShipmentStatus)
  @IsNotEmpty()
  status: ShipmentStatus;
}
