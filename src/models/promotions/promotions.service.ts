import { Injectable } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: SoftDeleteModel<PromotionDocument>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto, user: IUser) {
    return await this.promotionModel.create({
      ...createPromotionDto,
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

    const totalItems = (await this.promotionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.promotionModel
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
    return await this.promotionModel.findById(_id);
  }

  async update(_id: string, updatePromotionDto: UpdatePromotionDto, user: IUser) {
    return await this.promotionModel.updateOne(
      { _id },
      {
        ...updatePromotionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(_id: string, user: IUser) {
    await this.promotionModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.promotionModel.softDelete({ _id });
  }
}
