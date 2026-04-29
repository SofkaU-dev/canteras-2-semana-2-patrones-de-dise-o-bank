import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShipmentStatus } from '../../domain/models/shipment-status.enum';
import { ShipmentType } from '../../domain/models/shipment-type.enum';
import { CustomerTypeormEntity } from '../../../customers/infrastructure/persistence/customer.typeorm-entity';

@Entity('shipments')
export class ShipmentTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  senderId: string;

  @Column()
  recipientId: string;

  @ManyToOne(() => CustomerTypeormEntity)
  @JoinColumn({ name: 'senderId' })
  sender: CustomerTypeormEntity;

  @ManyToOne(() => CustomerTypeormEntity)
  @JoinColumn({ name: 'recipientId' })
  recipient: CustomerTypeormEntity;

  @Column('decimal', { precision: 12, scale: 2 })
  declaredValue: number;

  @Column('decimal', { precision: 12, scale: 2 })
  shippingCost: number;

  @Column({
    type: 'enum',
    enum: ShipmentType,
  })
  type: ShipmentType;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.PENDING,
  })
  status: ShipmentStatus;

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
