import { QueryDto, ReviewWithIdDto, WorkerIdDto } from './../dto/review.dto';
import { ReviewService } from './../services/review.service';
import Review from '../../../entity/review.entity';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Delete,
  Put,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ApiForbiddenResponse } from 'src/helpers/docs';
import { route } from './routes';
import { ReviewDto, idDto } from '../dto/review.dto';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AppRoles } from 'src/types';
import { Roles } from 'src/types/roles.decorator';
import { CheckIdValidGuard } from 'src/guards/check-id-valid.guard';
import { CheckRecordExistGuard } from 'src/guards/check-record-exist.guard';
import {
  CheckManagerIsActive,
  CheckUserIsActive,
} from 'src/guards/check-user-active-status.guard';
import { CheckIfOwnerGuard } from 'src/guards/check-if-owner.guard';

@ApiTags(route.main)
@Controller(route.main)
export class ReviewController {
  constructor(
    private reviewService: ReviewService,
    private jwtService: JwtService,
  ) {}

  @ApiResponse({
    status: 200,
    type: ReviewDto,
    description: 'Successfully got rewievs list.',
  })
  @ApiForbiddenResponse()
  @Get(route.children.getReviews)
  findAll(@Query() queryConfig: QueryDto) {
    return this.reviewService.getAllReviews(queryConfig);
  }

  @ApiResponse({
    status: 200,
    type: Review,
    description: 'Successfully got rewiev by id.',
  })
  @ApiForbiddenResponse()
  @Get(route.children.getCurrReview)
  @UseGuards(
    new CheckIdValidGuard({}),
    new CheckRecordExistGuard([{ field: 'id', Entity: Review }]),
  )
  async findById(@Param() id: idDto) {
    const review = await this.reviewService.getCurrentReview(id);
    return review;
  }

  @ApiResponse({
    status: 200,
    type: ReviewDto,
    description: 'Successfully got reviews by worker id',
  })
  @Get(route.children.getReviewByWorkerId)
  @UseGuards()
  async findByWorkerId(@Param() workerId: WorkerIdDto) {
    return this.reviewService.getReviewsByWorkerId(workerId);
  }

  @UseGuards(JWTAuthGuard, RolesGuard, CheckUserIsActive)
  @Roles(AppRoles.CompanyManager)
  @ApiResponse({
    status: 200,
    type: ReviewDto,
    description:
      'Review has been successfully created by CompanyManager. When creating a `REVIEW`, if the linkedin profile is unique (does not exist in the workers table), a new` WORKER` is added to this table.',
  })
  @ApiForbiddenResponse()
  @Post(route.children.createReview)
  create(@Body() reviewDto: ReviewDto, @Req() request) {
    // We get user object from token
    // And put it in request.user in JWTAuthGuard
    return this.reviewService.createReview(reviewDto, request.user.id);
  }

  @Roles(AppRoles.CgsManager, AppRoles.CompanyManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    CheckManagerIsActive,
    new CheckIdValidGuard({}),
    new CheckRecordExistGuard([{ field: 'id', Entity: Review }]),
    new CheckIfOwnerGuard({ Entity: Review, isManager: true }),
  )
  @ApiResponse({
    status: 200,
    type: Review,
    description: 'Successfully delete rewiev by id.',
  })
  @ApiForbiddenResponse()
  @Delete(route.children.deleteCurrReview)
  async delete(@Param() id: idDto) {
    return this.reviewService.deleteReview(id);
  }

  @Roles(AppRoles.CgsManager, AppRoles.CompanyManager)
  @UseGuards(
    JWTAuthGuard,
    RolesGuard,
    CheckManagerIsActive,
    new CheckIdValidGuard({ findIn: 'body' }),
    new CheckRecordExistGuard([{ field: 'id', Entity: Review }]),
    new CheckIfOwnerGuard({ Entity: Review, isManager: true }),
  )
  @ApiResponse({
    status: 200,
    type: Review,
    description: 'Successfully update rewiev by id.',
  })
  @ApiForbiddenResponse()
  @Put(route.children.updateCurrReview)
  update(@Body() reviewDto: ReviewWithIdDto) {
    return this.reviewService.updateCurrentReview(reviewDto);
  }
}
