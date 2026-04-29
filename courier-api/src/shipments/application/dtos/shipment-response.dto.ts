import { ApiProperty } from '@nestjs/swagger';
import { ShipmentStatus } from '../../domain/models/shipment-status.enum';
import { ShipmentType } from '../../domain/models/shipment-type.enum';

export class ShipmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  recipientId: string;

  @ApiProperty()
  declaredValue: number;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty({ enum: ShipmentType })
  type: ShipmentType;

  @ApiProperty({ enum: ShipmentStatus })
  status: ShipmentStatus;

  @ApiProperty()
  metadata: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
