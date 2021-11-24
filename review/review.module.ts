import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
