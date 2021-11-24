import { QueryDto } from './../dto/worker.dto';
import Worker from 'src/entity/worker.entity';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkerService } from '../services/worker.service';
import { route } from './routes';

@ApiTags(route.main)
@Controller(route.main)
export class WorkerController {
  constructor(private workerService: WorkerService) {}

  @ApiResponse({ status: 200, type: [Worker] })
  @ApiForbiddenResponse()
  @Get(route.children.getWorkers)
  getWorkers(@Param() data: QueryDto) {
    return this.workerService.getAllWorkers(data);
  }
}
