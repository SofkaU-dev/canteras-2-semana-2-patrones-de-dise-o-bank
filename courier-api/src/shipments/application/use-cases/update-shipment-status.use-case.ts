import { Injectable } from '@nestjs/common';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentStatus } from '../../domain/models/shipment-status.enum';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { UpdateShipmentStatusDto } from '../dtos/update-shipment-status.dto';

@Injectable()
export class UpdateShipmentStatusUseCase {
  constructor(
    private readonly shipmentRepository: ShipmentRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, dto: UpdateShipmentStatusDto): Promise<ShipmentModel> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new ShipmentNotFoundException(id);
    }

    const updatedShipment = shipment.updateStatus(dto.status);
    const savedShipment = await this.shipmentRepository.save(updatedShipment);

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
