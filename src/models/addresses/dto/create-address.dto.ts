import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'ID User không được bỏ trống' })
  @IsMongoId({ message: 'ID User phải là kiểu ObjectId' })
  user: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Họ và tên không được bỏ trống' })
  @IsString({ message: 'Họ và tên phải là kiểu String' })
  fullName: string;

  @IsNotEmpty({ message: 'Tên đường không được bỏ trống' })
  @IsString({ message: 'Tên đường phải là kiểu String' })
  streetAddress: string;

  @IsNotEmpty({ message: 'Tên tỉnh không được bỏ trống' })
  @IsString({ message: 'Tên tỉnh phải là kiểu String' })
  province: string;

  @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
  @IsString({ message: 'Số điện thoại phải là kiểu String' })
  phoneNumber: string;
}
