import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RoleType } from 'src/common/enums/roleType';
import { RegisterUserDto } from './dto/register-user.dto';
import { RolesService } from '../roles/roles.service';

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

  findAll() {
    return `This action returns all users`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
