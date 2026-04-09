import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

@Injectable()
export class TransferEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'transfer.completed',
    'transfer.clearing',
    'transfer.failed',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'bank-api'),
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
          groupId: this.config.get<string>(
            'KAFKA_CONSUMER_GROUP',
            'bank-api-group',
          ),
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

        console.log(
          `[TransferEventsConsumer] Listening on topics: ${this.topics.join(', ')}`,
        );
        return;
      } catch (error) {
        console.warn(
          `[TransferEventsConsumer] Attempt ${attempt}/${retries} failed: ${error.message}`,
        );
        try {
          await this.consumer.disconnect();
        } catch {}
        if (attempt === retries) {
          console.error(
            '[TransferEventsConsumer] Could not connect after retries.',
          );
          return;
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    console.log('[TransferEventsConsumer] Consumer disconnected');
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, message } = payload;
    const event = JSON.parse(message.value?.toString() ?? '{}');

    switch (topic) {
      case 'transfer.completed':
        await this.onTransferCompleted(event);
        break;
      case 'transfer.clearing':
        await this.onTransferClearing(event);
        break;
      case 'transfer.failed':
        await this.onTransferFailed(event);
        break;
    }
  }

  private async onTransferCompleted(
    event: Record<string, any>,
  ): Promise<void> {
    console.log(
      `[Observer:Notification] ✅ Transfer COMPLETED | ` +
        `ID: ${event.transferId} | ` +
        `From: ${event.sourceUserId} → To: ${event.targetUserId} | ` +
        `Amount: $${event.amount} | Fee: $${event.fee} | ` +
        `Type: ${event.type}`,
    );
    // Here you would integrate: email service, push notification, SMS, etc.
  }

  private async onTransferClearing(
    event: Record<string, any>,
  ): Promise<void> {
    console.log(
      `[Observer:Notification] ⏳ Transfer CLEARING | ` +
        `ID: ${event.transferId} | ` +
        `From: ${event.sourceUserId} → To: ${event.targetUserId} | ` +
        `Amount: $${event.amount} | Type: ${event.type} | ` +
        `Funds will be available after clearing period`,
    );
  }

  private async onTransferFailed(event: Record<string, any>): Promise<void> {
    console.log(
      `[Observer:Notification] ❌ Transfer FAILED | ` +
        `ID: ${event.transferId} | ` +
        `From: ${event.sourceUserId} → To: ${event.targetUserId} | ` +
        `Amount: $${event.amount} | Type: ${event.type}`,
    );
  }
}
