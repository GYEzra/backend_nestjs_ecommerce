import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNotEmpty({ message: 'ID của người dùng không được bỏ trống' })
  @IsMongoId({ message: 'ID của người dùng phải là kiểu MongoId' })
  _id: string;
}
