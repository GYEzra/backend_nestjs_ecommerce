import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Variant, VariantSchema } from '../schemas/variant.schema';
import mongoose from 'mongoose';

export class CreateVariantDto {
  @IsNotEmpty({ message: 'ID product không được bỏ trống' })
  @IsMongoId({ message: 'ID product phải là kiểu MongoId' })
  product: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Sku không được bỏ trống' })
  sku: string;

  @IsOptional()
  @IsString({ message: 'Màu biến thể phải là kiểu String' })
  color: string;

  @IsOptional()
  @IsString({ message: 'Kích thước biến thể phải là kiểu String' })
  size: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0, allowInfinity: false, allowNaN: false },
    { message: 'Số lượng kho biến thể phải là kiểu Number' },
  )
  stock: number;
}
