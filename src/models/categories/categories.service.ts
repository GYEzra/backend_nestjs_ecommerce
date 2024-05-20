import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import mongoose from 'mongoose';
import { CUSTOM_MESSAGES } from 'src/common/enums/enums';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: IUser) {
    const isExist = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (isExist) throw new BadRequestException('Tên danh mục đã tồn tại');

    return await this.categoryModel.create({
      ...createCategoryDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    return await this.categoryModel.findOne({ _id: id });
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(CUSTOM_MESSAGES.ERROR_MONGO_ID);

    return await this.categoryModel.updateOne(
      { _id },
      {
        name: updateCategoryDto.name,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(CUSTOM_MESSAGES.ERROR_MONGO_ID);

    await this.categoryModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.categoryModel.softDelete({ _id });
  }
}
