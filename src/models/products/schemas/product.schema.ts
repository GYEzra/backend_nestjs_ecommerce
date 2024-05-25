import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/models/categories/schemas/category.schema';
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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Variant.name }] })
  variants: Variant[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, required: true })
  category: Category;

  @Prop()
  description: string;

  @Prop()
  gender: string;

  @Prop()
  fabric: string;

  @Prop()
  care_instructions: string;

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
