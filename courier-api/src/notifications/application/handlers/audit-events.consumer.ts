import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

@Injectable()
export class AuditEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'shipment.dispatched',
    'shipment.in_customs',
    'shipment.failed',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId:
        this.config.get<string>('KAFKA_CLIENT_ID', 'courier-api') + '-audit',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9094')],
      logLevel: logLevel.WARN,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(retries = 5, delay = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.consumer = this.kafka.consumer({
          groupId: 'courier-api-audit-group',
          retry: { retries: 3 },
        });

        await this.consumer.connect();

        for (const topic of this.topics) {
          await this.consumer.subscribe({ topic, fromBeginning: false });
        }

        await this.consumer.run({
          eachMessage: async (payload: EachMessagePayload) => {
            await this.handleMessage(payload);
          },
        });

        console.log('[AuditEventsConsumer] Listening for audit events');
        return;
      } catch (error) {
        if (attempt === retries) {
          console.error(
            `[AuditEventsConsumer] Failed to connect after ${retries} attempts`,
          );
          return;
        }
        console.warn(
          `[AuditEventsConsumer] Connection failed (attempt ${attempt}/${retries}). Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private async handleMessage({
    topic,
    partition,
    message,
  }: EachMessagePayload): Promise<void> {
    const value = message.value?.toString();
    const event = value ? JSON.parse(value) : null;

    console.log('[Audit Log]', {
      topic,
      partition,
      offset: message.offset,
      shipmentId: event?.shipmentId,
      timestamp: message.timestamp,
      event,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}
