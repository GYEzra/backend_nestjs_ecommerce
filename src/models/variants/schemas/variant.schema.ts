import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VariantDocument = HydratedDocument<Variant>;

@Schema({ timestamps: true })
export class Variant {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  product: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  sku: string;

  @Prop()
  color: string;

  @Prop()
  size: string;

  @Prop()
  stock: number;

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

export const VariantSchema = SchemaFactory.createForClass(Variant);
