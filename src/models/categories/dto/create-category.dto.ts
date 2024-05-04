import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Tên danh mục không được bỏ trống' })
  @IsString({ message: 'Định dạng tên danh mục phải là kiểu String' })
  name: string;
}
