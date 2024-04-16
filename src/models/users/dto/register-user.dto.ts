import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class RegisterUserDto extends PickType(CreateUserDto, [
  'fullname',
  'email',
  'password',
  'role',
] as const) {}
