import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShipmentUseCase } from '../../application/use-cases/create-shipment.use-case';
import { FindShipmentUseCase } from '../../application/use-cases/find-shipment.use-case';
import { FindCustomerShipmentsUseCase } from '../../application/use-cases/find-customer-shipments.use-case';
import { UpdateShipmentStatusUseCase } from '../../application/use-cases/update-shipment-status.use-case';
import { CreateShipmentDto } from '../../application/dtos/create-shipment.dto';
import { UpdateShipmentStatusDto } from '../../application/dtos/update-shipment-status.dto';
import { ShipmentResponseDto } from '../../application/dtos/shipment-response.dto';

@ApiTags('shipments')
@Controller('shipments')
export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly findShipmentUseCase: FindShipmentUseCase,
    private readonly findCustomerShipmentsUseCase: FindCustomerShipmentsUseCase,
    private readonly updateShipmentStatusUseCase: UpdateShipmentStatusUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, type: ShipmentResponseDto })
  async create(@Body() createShipmentDto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    return this.createShipmentUseCase.execute(createShipmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update shipment status' })
  @ApiResponse({ status: 200, type: ShipmentResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateShipmentStatusDto: UpdateShipmentStatusDto,
  ): Promise<ShipmentResponseDto> {
    return this.updateShipmentStatusUseCase.execute(id, updateShipmentStatusDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipment by id' })
  @ApiResponse({ status: 200, type: ShipmentResponseDto })
  async findOne(@Param('id') id: string): Promise<ShipmentResponseDto> {
    return this.findShipmentUseCase.execute(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all shipments for a customer' })
  @ApiResponse({ status: 200, type: [ShipmentResponseDto] })
  async findByCustomer(
    @Param('customerId') customerId: string,
  ): Promise<ShipmentResponseDto[]> {
    return this.findCustomerShipmentsUseCase.execute(customerId);
  }
}
