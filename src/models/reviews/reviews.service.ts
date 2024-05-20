import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import mongoose, { isValidObjectId } from 'mongoose';
import { CUSTOM_MESSAGES } from 'src/common/enums/enums';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: SoftDeleteModel<ReviewDocument>) {}

  create(createReviewDto: CreateReviewDto) {
    return 'This action adds a new review';
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }

  async getAvgRating(_id: string): Promise<number> {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(CUSTOM_MESSAGES.ERROR_MONGO_ID);
    }
    const reviews = await this.reviewModel.find().exec();
    const sum = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
    return sum / reviews.length;
  }
}
