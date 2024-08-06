import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../products/schemas/product.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    description: 'ID sản phẩm',
    example: '64d8c080a78a9c46126a8a2a',
    required: true,
  })
  @IsNotEmpty({ message: 'Product ID không được để trống' })
  @IsString({ message: 'Product ID phải là kiểu String' })
  productId: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'Quantity không được để trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Quantity không hợp lệ' },
  )
  quantity: number;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 100000,
    required: true,
  })
  @IsNotEmpty({ message: 'Price không được để trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Price không hợp lệ' },
  )
  price: number;

  @ApiProperty({
    description: 'Màu sắc sản phẩm',
    example: 'Màu sắc 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Color không được để trống' })
  @IsString({ message: 'Color phải là kiểu String' })
  color: string;

  @ApiProperty({
    description: 'Kích cỡ sản phẩm',
    example: 'Kích cỡ 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Size không được để trống' })
  @IsString({ message: 'Size phải là kiểu String' })
  size: string;
}
