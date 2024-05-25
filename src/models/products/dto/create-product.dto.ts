import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { GenderType } from 'src/common/enums/enums';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Tên sản phẩm không được trống' })
  @IsString({ message: 'Tên sản phẩm phải là kiểu String' })
  name: string;

  @IsNotEmpty({ message: 'Giá bán không được trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Giá bán không hợp lệ' },
  )
  price: number;

  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là kiểu String', each: true })
  images: string[];

  @IsOptional()
  @IsArray({ message: 'Các biến thể phải là kiểu Array' })
  @IsMongoId({ each: true, message: 'Biến thể phải là kiểu MongoId' })
  variants: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  @IsMongoId({ message: 'ID danh mục phải là kiểu MongoId' })
  category: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description: string;

  @IsOptional()
  @IsEnum(GenderType, { message: 'Giới tính phải là kiểu Nam/Nữ/Unisex' })
  gender: string;

  @IsOptional()
  @IsString({ message: 'Chất liệu phải là kiểu String' })
  fabric: string;

  @IsOptional()
  @IsString({ message: 'Hướng dẫn bảo quản phải là kiểu String' })
  care_instructions: string;
}
