import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ResponseMessage('Tạo mới đánh giá')
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @User() user: IUser) {
    return await this.reviewsService.create(createReviewDto, user);
  }

  @ResponseMessage('Lấy danh sách đánh giá')
  @Get()
  async findAll(@Query() query: string) {
    return await this.reviewsService.findAll(query);
  }

  @ResponseMessage('Lấy thông tin của đánh giá')
  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) _id: string) {
    return await this.reviewsService.findOne(_id);
  }

  @ResponseMessage('Cập nhật đánh giá')
  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @User() user: IUser,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @ResponseMessage('Xóa đánh giá')
  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) _id: string, @User() user: IUser) {
    return this.reviewsService.remove(_id, user);
  }
}
