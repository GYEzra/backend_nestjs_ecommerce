import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import mongoose from 'mongoose';
import { GenderType } from 'src/common/enums/genderType';

export class CreateUserDto {
  @IsEmail({}, { message: 'Vui lòng nhập đúng định email' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @IsString({ message: 'Vui lòng nhập đúng định dạng mật khẩu' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Mật khẩu tối thiểu 8 ký tự và bao gồm các ký tự in hoa, số và 1 ký tự đặc biệt',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Tên người dùng không được bỏ trống' })
  @IsString({ message: 'Vui lòng nhập đúng định dạng tên người dùng' })
  fullname: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0, allowInfinity: false },
    { message: 'Vui lòng nhập đúng định dạng của tuổi' },
  )
  age: number;

  @IsOptional()
  @IsString({ message: 'Vui lòng nhập đúng định dạng' })
  address: string;

  @IsOptional()
  @IsEnum(GenderType, { message: 'Vui lòng nhập đúng định dạng giới tính' })
  gender: GenderType;

  @IsNotEmpty({ message: 'Vai trò không được bỏ trống' })
  @IsMongoId({ message: 'Vui lòng  nhập đúng định dạng của vai trò' })
  role: mongoose.Schema.Types.ObjectId;
}
