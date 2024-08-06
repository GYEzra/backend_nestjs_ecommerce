import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/models/users/schemas/user.schema';
import { CartItem } from './cart-item.schema';
import { Promotion } from 'src/models/promotions/schemas/promotion.schema';
import { Address } from 'src/models/addresses/schemas/address.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop()
  shipping_method: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Address.name })
  shipping_address: Address;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Promotion.name })
  promotion: Promotion;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
