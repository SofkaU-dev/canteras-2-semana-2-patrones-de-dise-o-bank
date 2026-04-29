import { Module } from '@nestjs/common';
import { ShipmentEventsConsumer } from './application/handlers/shipment-events.consumer';
import { AuditEventsConsumer } from './application/handlers/audit-events.consumer';

@Module({
  providers: [ShipmentEventsConsumer, AuditEventsConsumer],
})
export class NotificationsModule {}
