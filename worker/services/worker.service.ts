import { Injectable } from '@nestjs/common';
import Worker from 'src/entity/worker.entity';
import { Like } from 'typeorm';

@Injectable()
export class WorkerService {
  async getAllWorkers({ page = '1', size = '10', search = '' }) {
    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;
    const workers = await Worker.find({
      relations: ['reviews'],
      skip: Number(skip),
      take: Number(limit),
      where: [
        { name: Like(search + '%') },
        { specialization: Like(search + '%') },
        { linkedIn: Like(search + '%') },
      ],
    });
    return workers;
  }
}
