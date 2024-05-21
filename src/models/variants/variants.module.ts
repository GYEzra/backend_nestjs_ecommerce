import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variant, VariantSchema } from './schemas/variant.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Variant.name, schema: VariantSchema }])],
  controllers: [VariantsController],
  providers: [VariantsService],
})
export class VariantsModule {}
