import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTransferDto } from '../../application/dtos/create-transfer.dto';
import { TransferResponseDto } from '../../application/dtos/transfer-response.dto';
import { ExecuteTransferUseCase } from '../../application/use-cases/execute-transfer.use-case';
import { FindTransferUseCase } from '../../application/use-cases/find-transfer.use-case';
import { FindUserTransfersUseCase } from '../../application/use-cases/find-user-transfers.use-case';

@Controller('transfers')
export class TransferController {
  constructor(
    private readonly executeTransferUseCase: ExecuteTransferUseCase,
    private readonly findTransferUseCase: FindTransferUseCase,
    private readonly findUserTransfersUseCase: FindUserTransfersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  execute(@Body() dto: CreateTransferDto): Promise<TransferResponseDto> {
    return this.executeTransferUseCase.execute(dto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransferResponseDto> {
    return this.findTransferUseCase.execute(id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<TransferResponseDto[]> {
    return this.findUserTransfersUseCase.execute(userId);
  }
}
