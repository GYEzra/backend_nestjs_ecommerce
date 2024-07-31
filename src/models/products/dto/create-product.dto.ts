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
  @IsMongoId({ message: 'Category danh mục phải là kiểu MongoId' })
  category: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Chất liệu phải là kiểu String' })
  fabric: string;

  @IsOptional()
  @IsString({ message: 'Hướng dẫn bảo quản phải là kiểu String' })
  care_instructions: string;
}
