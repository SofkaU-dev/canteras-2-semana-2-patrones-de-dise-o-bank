import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

@Injectable()
export class ShipmentEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'shipment.dispatched',
    'shipment.in_customs',
    'shipment.failed',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'courier-api') + '-notifications',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9094')],
      logLevel: logLevel.WARN,
    });
    this.consumer = this.kafka.consumer({ groupId: 'courier-notifications-group' });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.consumer.connect();
      for (const topic of this.topics) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
      }

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          const { topic, message } = payload;
          const event = JSON.parse(message.value?.toString() || '{}');
          this.handleEvent(topic, event);
        },
      });
      console.log(`[ShipmentEventsConsumer] Subscribed to: ${this.topics.join(', ')}`);
    } catch (error) {
      console.error('[ShipmentEventsConsumer] Error connecting to Kafka:', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  private handleEvent(topic: string, event: any): void {
    console.log(`[Notification Service] Simulating notification for ${topic}:`, {
      shipmentId: event.shipmentId,
      status: event.status,
      message: `Shipment ${event.shipmentId} is now ${event.status}`,
      timestamp: event.timestamp,
    });
  }
}
