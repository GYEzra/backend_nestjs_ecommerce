import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/models/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/models/roles/schemas/role.schema';
import { User, UserDocument } from 'src/models/users/schemas/user.schema';
import { UsersService } from 'src/models/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './master-data';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('HAS_INIT') === 'true' ? true : false;

    if (isInit) {
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      const countUser = await this.userModel.countDocuments({});

      if (countPermission === 0) await this.permissionModel.insertMany(INIT_PERMISSIONS);

      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin full quyền',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'USER không có quyền',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      if (countUser === 0) {
        const roleAdmin = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const roleUser = await this.roleModel.findOne({ name: USER_ROLE });
        const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
        const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
        const password = await this.userService.getHashPassword(adminPassword);

        await this.userModel.insertMany([
          {
            email: 'user@gmail.com',
            password: password,
            fullname: 'Người dùng',
            address: 'TPHCM',
            role: roleUser._id,
          },
          {
            email: adminEmail,
            password: password,
            fullname: 'Quản trị viên',
            address: 'TPHCM',
            role: roleAdmin._id,
          },
        ]);

        this.logger.log('Init Data Success');
      }
    }
  }
}
