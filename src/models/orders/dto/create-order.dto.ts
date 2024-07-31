import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { PaymentMethod, PaymentStatus, ShippingMethod } from 'src/common/enums/enums';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'ID giỏ hàng không được bỏ trống' })
  @IsMongoId({ message: 'ID giỏ hàng phải là kiểu MongoID' })
  cart: mongoose.Schema.Types.ObjectId;
}
