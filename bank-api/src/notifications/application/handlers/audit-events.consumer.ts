import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

@Injectable()
export class AuditEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'transfer.completed',
    'transfer.clearing',
    'transfer.failed',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId:
        this.config.get<string>('KAFKA_CLIENT_ID', 'bank-api') + '-audit',
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
          groupId: 'bank-api-audit-group',
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
        console.warn(
          `[AuditEventsConsumer] Attempt ${attempt}/${retries} failed: ${error.message}`,
        );
        try {
          await this.consumer.disconnect();
        } catch {}
        if (attempt === retries) {
          console.error(
            '[AuditEventsConsumer] Could not connect after retries.',
          );
          return;
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const event = JSON.parse(message.value?.toString() ?? '{}');

    console.log(
      `[Observer:Audit] 📋 ${topic} | ` +
        `Partition: ${partition} | ` +
        `Offset: ${message.offset} | ` +
        `Transfer: ${event.transferId} | ` +
        `Timestamp: ${event.timestamp}`,
    );
    // Here you would persist to an audit log table
  }
}
