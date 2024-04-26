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
import { GenderType } from 'src/common/enums/genderType';

export class CreateUserDto {
  @IsEmail({}, { message: 'Vui lòng nhập đúng định email' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @IsString({ message: 'Mật khẩu phải là kiểu String' })
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
  @IsString({ message: 'Tên người dùng phải là kiểu String' })
  fullname: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 0, allowInfinity: false },
    { message: 'Tuổi phải là kiểu số nguyên' },
  )
  age: number;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là kiểu String' })
  address: string;

  @IsOptional()
  @IsEnum(GenderType, { message: 'Giới tính phải là kiểu Nam hoặc Nữ' })
  gender: GenderType;

  @IsOptional()
  @IsMongoId({ message: 'Role phải là kiểu MongoId' })
  role: string;
}
