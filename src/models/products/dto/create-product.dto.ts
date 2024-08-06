import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Sản phẩm 1',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được trống' })
  @IsString({ message: 'Tên sản phẩm phải là kiểu String' })
  name: string;

  @ApiProperty({
    minimum: 0,
    maximum: 1000000000,
    description: 'Giá bán',
    example: 100000,
    required: true,
  })
  @IsNotEmpty({ message: 'Price không được trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Price không hợp lệ' },
  )
  price: number;

  @ApiProperty({
    description: 'Màu sắc sản phẩm',
    example: ['Màu sắc 1', 'Màu sắc 2'],
    required: true,
  })
  @IsNotEmpty({ message: 'Colors không được trống' })
  @IsArray({ message: 'Colors phải là kiểu Array' })
  colors: string[];

  @ApiProperty({
    description: 'Kích cỡ sản phẩm',
    example: ['Kích cỡ 1', 'Kích cỡ 2'],
    required: true,
  })
  @IsNotEmpty({ message: 'Sizes không được trống' })
  @IsArray({ message: 'Sizes phải là kiểu Array' })
  sizes: string[];

  @ApiProperty({
    description: 'Số lượng kho của sản phẩm',
    example: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'Stock không được trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Stock không hợp lệ' },
  )
  stock: number;

  @ApiProperty({
    description: 'ID danh mục sản phẩm',
    example: '64d8c080a78a9c46126a8a2a',
    required: true,
  })
  @IsNotEmpty({ message: 'Category không được trống' })
  @IsMongoId({ message: 'Category phải là kiểu MongoId' })
  categoryId: string;

  @ApiProperty({
    type: [String],
    description: 'Hình ảnh sản phẩm (Thực hiện upload file để có tên hình ảnh)',
    example: [
      '906a3aa4-870a-4922-a418-2cdad00d09e2.jpg',
      'e2ccb489-21e0-43a5-9a8d-f1be2ef547cf.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Hình ảnh phải là kiểu String', each: true })
  images?: string[];

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: 'Sản phẩm 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description phải là kiểu String' })
  description?: string;

  @ApiProperty({
    description: 'Chất liệu sản phẩm',
    example: 'Chất liệu 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Fabric phải là kiểu String' })
  fabric?: string;

  @ApiProperty({
    description: 'Hướng dẫn bảo quản sản phẩm',
    example: 'Hướng dẫn bảo quản 1',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Care Instructions phải là kiểu String' })
  care_instructions: string;
}
