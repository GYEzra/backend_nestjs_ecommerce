import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'email',
  'password',
] as const) {
  @IsNotEmpty({ message: 'ID của người dùng không được bỏ trống' })
  @IsMongoId({ message: 'ID của người dùng phải là kiểu MongoId' })
  _id: string;
}
