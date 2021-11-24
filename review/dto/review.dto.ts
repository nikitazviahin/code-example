import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import Worker from '../../../entity/worker.entity';
import { ApiProperty } from '@nestjs/swagger';

//TODO: move to global
export class idDto {
  @ApiProperty()
  id: string;
}

export class WorkerIdDto {
  @ApiProperty()
  workerId: string;
}

export class FullWorkerBody extends Worker {
  @ApiProperty()
  @IsDefined()
  name: string;
  @ApiProperty()
  @IsDefined()
  specialization: string;
  @ApiProperty()
  @IsDefined()
  linkedIn: string;
}

export class ReviewDto {
  @ApiProperty()
  rate: number;
  @ApiProperty()
  title?: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  @ValidateNested({
    each: true,
  })
  @Type(() => FullWorkerBody)
  worker: FullWorkerBody;
}

export class ReviewWithIdDto extends ReviewDto {
  @ApiProperty()
  id: string;
}

export class QueryDto {
  @ApiProperty()
  page?: string;
  @ApiProperty()
  size?: string;
  @ApiProperty()
  search?: string;
}
