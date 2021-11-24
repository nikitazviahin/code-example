import { WorkerController } from './controller/worker.controller';
import { WorkerService } from './services/worker.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
