import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty({ message: 'ID của người dùng không được bỏ trống' })
  @IsMongoId({ message: 'ID của người dùng phải là kiểu MongoId' })
  _id: string;
}
