import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Variant, VariantDocument } from './schemas/variant.schema';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { CUSTOM_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class VariantsService {
  constructor(@InjectModel(Variant.name) private variantModel: SoftDeleteModel<VariantDocument>) {}

  async create(createVariantDto: CreateVariantDto, user: IUser) {
    const exist = await this.variantModel.findOne({ sku: createVariantDto.sku });

    if (exist) throw new BadRequestException('Sku đã tồn tại!');

    return await this.variantModel.create({
      ...createVariantDto,
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

    const totalItems = (await this.variantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.variantModel
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
    return await this.variantModel.findById(_id);
  }

  async update(_id: string, updateVariantDto: UpdateVariantDto, user: IUser) {
    return await this.variantModel.updateOne(
      { _id },
      {
        ...updateVariantDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(_id: string, user: IUser) {
    await this.variantModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return await this.variantModel.softDelete({ _id });
  }

  async checkStock(variantId: string, quantity: number): Promise<boolean> {
    const variant = await this.variantModel.findById(variantId);
    if (!variant) {
      throw new NotFoundException('Biến thể này không tồn tại');
    }

    return variant.stock >= quantity;
  }
}
