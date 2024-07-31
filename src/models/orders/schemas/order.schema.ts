import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Address } from 'src/models/addresses/schemas/address.schema';
import { CartItem } from 'src/models/carts/schemas/cart-item.schema';
import { Promotion } from 'src/models/promotions/schemas/promotion.schema';
import { User } from 'src/models/users/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: CartItem.name })
  items: CartItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Promotion.name })
  promotion: Promotion;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Address.name })
  shipping_address: Address;

  @Prop()
  shipping_method: string;

  @Prop()
  shipping_cost: number;

  @Prop()
  payment_method: string;

  @Prop()
  payment_status: string;

  @Prop()
  shipping_note: string;

  @Prop({ required: true })
  order_status: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
