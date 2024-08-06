import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/models/products/schemas/product.schema';

export type CartItemDocument = HydratedDocument<CartItem>;

@Schema()
export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String, required: true })
  color: string;

  @Prop({ type: String, required: true })
  size: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
