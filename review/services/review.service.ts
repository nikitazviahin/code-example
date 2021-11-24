import { Injectable } from '@nestjs/common';
import Review from 'src/entity/review.entity';
import Worker from 'src/entity/worker.entity';
import User from 'src/entity/user.entity';
import { Like } from 'typeorm';
import {
  ReviewDto,
  idDto,
  QueryDto,
  ReviewWithIdDto,
  WorkerIdDto,
} from '../dto/review.dto';

//TODO: always return idDto
@Injectable()
export class ReviewService {
  async createReview(data: ReviewDto, userId: string) {
    const worker = await this.checkIfWorkerExist(data.worker);

    // Finding company by using userId
    const { company } = await User.findOne(userId, {
      relations: ['company'],
    });
    const companyId: string = company.id;

    const review = Review.create({
      ...data,
      user: { id: userId },
      company: { id: companyId },
      worker,
    });
    return await review.save();
  }

  async deleteReview(id: idDto) {
    await Review.delete(id);
    return id;
  }

  // search by title FName LName LinkedIn
  async getAllReviews({
    page = '1',
    size = '10',
    search = '',
  }: QueryDto): Promise<Review[]> {
    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;
    const review = await Review.createQueryBuilder('review')
      .skip(Number(skip))
      .take(Number(limit))
      .where([
        { title: Like(search + '%') },
        { description: Like(search + '%') },
      ])
      .leftJoin('review.company', 'company')
      .leftJoin('review.user', 'user')
      .leftJoin('review.worker', 'worker')
      .select([
        'review',
        'worker',
        'user.id',
        'company.name',
        'company.id',
        'company.taxCode',
      ])
      .orderBy('review.created_at', 'ASC')
      .getMany();
    return review;
  }

  async getCurrentReview(id: idDto) {
    const review = await Review.createQueryBuilder('review')
      .where(id)
      .leftJoin('review.company', 'company')
      .leftJoin('review.user', 'user')
      .leftJoin('review.worker', 'worker')
      .select([
        'review',
        'worker',
        'user.id',
        'company.name',
        'company.id',
        'company.taxCode',
      ])
      .getOne();
    return review;
  }

  async getReviewsByWorkerId({ workerId }): Promise<Review[]> {
    const reviews = await Review.find({
      relations: ['worker', 'company'],
      where: {
        worker: workerId,
      },
    });

    return reviews;
  }

  async updateCurrentReview(data: ReviewWithIdDto) {
    const { id, ...review } = data;

    review.worker = await this.checkIfWorkerExist(review.worker);

    await Review.update(id, review);
    return data.id;
  }

  async checkIfWorkerExist(worker: Worker) {
    let record = await Worker.findOne({ linkedIn: worker.linkedIn });
    // Check if worker does not exist.
    if (!record) {
      record = await Worker.save(worker);
    }
    return record;
  }
}
