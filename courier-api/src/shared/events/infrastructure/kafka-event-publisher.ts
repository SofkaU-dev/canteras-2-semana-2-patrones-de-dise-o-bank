import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Admin, logLevel, Partitioners } from 'kafkajs';
import { EventPublisherPort } from '../ports/event-publisher.port';

@Injectable()
export class KafkaEventPublisher
  extends EventPublisherPort
  implements OnModuleInit, OnModuleDestroy
{
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;

  static readonly TOPICS = [
    'shipment.dispatched',
    'shipment.in_customs',
    'shipment.failed',
  ];

  constructor(private readonly config: ConfigService) {
    super();
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'courier-api'),
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9094')],
      logLevel: logLevel.WARN,
    });
    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    this.admin = this.kafka.admin();
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.admin.connect();
      await this.admin.createTopics({
        waitForLeaders: true,
        topics: KafkaEventPublisher.TOPICS.map((topic) => ({
          topic,
          numPartitions: 1,
          replicationFactor: 1,
        })),
      });
      await this.admin.disconnect();
      console.log(
        `[KafkaEventPublisher] Topics ensured: ${KafkaEventPublisher.TOPICS.join(', ')}`,
      );

      await this.producer.connect();
      console.log('[KafkaEventPublisher] Producer connected');
    } catch (error) {
      console.error('[KafkaEventPublisher] Error during initialization:', error);
    }
  }

  async publish(topic: string, payload: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
      });
    } catch (error) {
      console.error(`[KafkaEventPublisher] Error publishing to ${topic}:`, error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }
}
