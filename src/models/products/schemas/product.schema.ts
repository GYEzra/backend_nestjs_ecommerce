import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Review } from 'src/models/reviews/schemas/review.schema';
import { Variant } from 'src/models/variants/schemas/variant.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  category: mongoose.Schema.Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  gender: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Variant.name }] })
  variants: Variant[];

  @Prop()
  fabric: string;

  @Prop()
  care_instructions: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Review.name }] })
  reviews: Review[];

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

export const ProductSchema = SchemaFactory.createForClass(Product);
