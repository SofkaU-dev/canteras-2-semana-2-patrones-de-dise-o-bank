import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { CreateShipmentDto } from '../dtos/create-shipment.dto';
import { ShipmentStatus } from '../../domain/models/shipment-status.enum';
import { ShipmentType } from '../../domain/models/shipment-type.enum';
import { CustomerRepositoryPort } from '../../../customers/domain/ports/customer-repository.port';
import { CustomerNotFoundException } from '../../../customers/domain/exceptions/customer-not-found.exception';
import { StandardShippingStrategy } from '../strategies/standard-shipping.strategy';
import { ExpressShippingStrategy } from '../strategies/express-shipping.strategy';
import { InternationalShippingStrategy } from '../strategies/international-shipping.strategy';
import { ThirdPartyShippingStrategy } from '../strategies/third-party-shipping.strategy';
import { ShippingStrategyPort } from '../../domain/ports/shipping-strategy.port';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';

@Injectable()
export class CreateShipmentUseCase {
  private readonly strategies: Map<ShipmentType, ShippingStrategyPort>;

  constructor(
    private readonly shipmentRepository: ShipmentRepositoryPort,
    private readonly customerRepository: CustomerRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    standardStrategy: StandardShippingStrategy,
    expressStrategy: ExpressShippingStrategy,
    internationalStrategy: InternationalShippingStrategy,
    thirdPartyStrategy: ThirdPartyShippingStrategy,
  ) {
    this.strategies = new Map<ShipmentType, ShippingStrategyPort>([
      [ShipmentType.STANDARD, standardStrategy],
      [ShipmentType.EXPRESS, expressStrategy],
      [ShipmentType.INTERNATIONAL, internationalStrategy],
      [ShipmentType.THIRD_PARTY_CARRIER, thirdPartyStrategy],
    ]);
  }

  async execute(dto: CreateShipmentDto): Promise<ShipmentModel> {
    const sender = await this.customerRepository.findById(dto.senderId);
    if (!sender || !sender.isActive) {
      throw new CustomerNotFoundException(dto.senderId);
    }

    const recipient = await this.customerRepository.findById(dto.recipientId);
    if (!recipient || !recipient.isActive) {
      throw new CustomerNotFoundException(dto.recipientId);
    }

    const strategy = this.strategies.get(dto.type);
    if (!strategy) {
      throw new BadRequestException(`No strategy found for shipment type: ${dto.type}`);
    }

    // Create initial model to validate
    const initialShipment = new ShipmentModel({
      id: uuidv4(),
      senderId: dto.senderId,
      recipientId: dto.recipientId,
      declaredValue: dto.declaredValue,
      shippingCost: 0,
      type: dto.type,
      status: ShipmentStatus.PENDING,
      metadata: dto.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Validate using strategy
    await strategy.validate(initialShipment);

    // Calculate cost
    const shippingCost = strategy.calculateCost(dto.declaredValue, dto.metadata);

    // Create intermediate model with calculated cost
    const shipmentWithCost = new ShipmentModel({
      ...initialShipment,
      shippingCost,
    });

    // Execute strategy to get final status/model
    const finalShipment = await strategy.execute(shipmentWithCost);

    const savedShipment = await this.shipmentRepository.save(finalShipment);

    // Map status to topic
    const topic = this.getTopicForStatus(savedShipment.status);

    // Emit event via Kafka (Observer pattern)
    if (topic) {
      await this.eventPublisher.publish(topic, {
        shipmentId: savedShipment.id,
        senderId: savedShipment.senderId,
        recipientId: savedShipment.recipientId,
        declaredValue: savedShipment.declaredValue,
        shippingCost: savedShipment.shippingCost,
        type: savedShipment.type,
        status: savedShipment.status,
        timestamp: new Date().toISOString(),
      });
    }

    return savedShipment;
  }

  private getTopicForStatus(status: ShipmentStatus): string | null {
    switch (status) {
      case ShipmentStatus.DELIVERED:
        return 'shipment.dispatched';
      case ShipmentStatus.IN_CUSTOMS:
        return 'shipment.in_customs';
      case ShipmentStatus.FAILED:
        return 'shipment.failed';
      default:
        return null;
    }
  }
}
