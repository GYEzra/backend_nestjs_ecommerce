import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { isValidObjectId } from 'mongoose';
import { CUSTOM_MESSAGES } from 'src/common/enums/enums';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: SoftDeleteModel<ReviewDocument>) {}

  async create(createReviewDto: CreateReviewDto, user: IUser) {
    const existReview = await this.reviewModel.exists({
      user: user._id,
      product: createReviewDto.product,
    });

    if (existReview) throw new BadRequestException('Bạn đã đánh giá cho sản phẩm này rồi!');

    return await this.reviewModel.create({
      ...createReviewDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.reviewModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.reviewModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(_id: string) {
    return await this.reviewModel.findOne({ _id });
  }

  async update(_id: string, updateReviewDto: UpdateReviewDto, user: IUser) {
    return await this.reviewModel.updateOne(
      { _id },
      {
        ...updateReviewDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(_id: string, user: IUser) {
    await this.reviewModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.reviewModel.softDelete({ _id });
  }

  async getAvgRating(_id: string): Promise<number> {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException(CUSTOM_MESSAGES.ERROR_MONGO_ID);
    }
    const reviews = await this.reviewModel.find().exec();
    const sum = reviews.reduce((accumulator, review) => accumulator + review.score, 0);
    return sum / reviews.length;
  }
}
