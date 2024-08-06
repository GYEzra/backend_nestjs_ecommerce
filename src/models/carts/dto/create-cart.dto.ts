import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID người dùng',
    example: '64d8c080a78a9c46126a8a2a',
    required: true,
  })
  @IsNotEmpty({ message: 'UserId không được để trống' })
  @IsString({ message: 'UserId phải là kiểu String' })
  userId: string;

  @ApiProperty({
    description: 'Danh sách sản phẩm trong giỏ hàng',
    type: [CartItemDto],
    required: true,
    example: [
      {
        productId: '64d8c080a78a9c46126a8a2a',
        quantity: 1,
        color: 'Màu sắc 1',
        size: 'Kích cỡ 1',
      },
      {
        productId: '64d8c080a78a9c46126a8a2b',
        quantity: 2,
        color: 'Màu sắc 2',
        size: 'Kích cỡ 2',
      },
    ],
  })
  @IsNotEmpty({ message: 'items không được để trống' })
  @IsArray({ message: 'items phải là kiểu Array' })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
