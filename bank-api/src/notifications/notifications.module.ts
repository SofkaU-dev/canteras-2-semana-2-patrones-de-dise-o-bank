import { Module } from '@nestjs/common';
import { TransferEventsConsumer } from './application/handlers/transfer-events.consumer';
import { AuditEventsConsumer } from './application/handlers/audit-events.consumer';

@Module({
  providers: [TransferEventsConsumer, AuditEventsConsumer],
})
export class NotificationsModule {}
