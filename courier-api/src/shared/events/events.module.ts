import { Module } from '@nestjs/common';
import { EventPublisherPort } from './ports/event-publisher.port';
import { KafkaEventPublisher } from './infrastructure/kafka-event-publisher';

@Module({
  providers: [
    {
      provide: EventPublisherPort,
      useClass: KafkaEventPublisher,
    },
  ],
  exports: [EventPublisherPort],
})
export class EventsModule {}
