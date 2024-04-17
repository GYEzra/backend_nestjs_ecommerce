import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';
import aqp from 'api-query-params';
import { IUser } from 'src/common/interfaces/user.interface';
import { isMongoId } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto | RegisterUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });

    if (user) throw new BadRequestException(`Email ${user.email} đã tồn tại`);

    const hashPassword = await this.getHashPassword(createUserDto.password);
    const role = await this.rolesService.findOne(createUserDto.role);

    return await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      role,
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

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    let defaultSort = sort ? (sort as unknown as string) : '-updatedAt';

    const result = await this.userModel
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
    return await this.userModel.findById(id);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({ refresh_token: refreshToken });
  }

  async update(user: IUser, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(user: IUser, _id: string) {
    if (!isMongoId(_id))
      throw new BadRequestException('ID của người dùng phải là kiểu MongoId');

    await this.userModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id });
  }

  async updateUserToken(_id: string, refresh_token: string) {
    return await this.userModel.updateOne({ _id }, { refresh_token });
  }

  async getHashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async isValidPassword(password: string, hashPassword: string) {
    return await bcrypt.compareSync(password, hashPassword);
  }
}
