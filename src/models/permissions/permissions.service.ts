import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const permission = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    });

    if (permission) throw new BadRequestException('Permission đã tồn tại');

    let result = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: result.id,
      createdAt: result.createdAt,
    };
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.permissionModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (mongoose.isValidObjectId(id)) return await this.permissionModel.findOne({ _id: id });
    throw new NotFoundException(`ID #${id} không tồn tại`);
  }

  async update(updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return await this.permissionModel.updateOne(
      { _id: updatePermissionDto._id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.isValidObjectId(id)) throw new NotFoundException(`ID #${id} không tồn tại`);

    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return this.permissionModel.softDelete({ _id: id });
  }
}
