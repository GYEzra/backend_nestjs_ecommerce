import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import mongoose from 'mongoose';

export class CreateReviewDto {
  @IsMongoId({ message: 'Product phải là kiểu MongoID' })
  @IsNotEmpty({ message: 'Product không được bỏ trống' })
  product: mongoose.Schema.Types.ObjectId;

  @IsMongoId({ message: 'User phải là kiểu MongoID' })
  @IsNotEmpty({ message: 'User không được bỏ trống' })
  user: mongoose.Schema.Types.ObjectId;

  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0, allowNaN: false },
    { message: 'Điểm đánh giá phải từ 1 - 5' },
  )
  @Min(1, { message: 'Điểm đánh giá không được nhỏ hơn 1' })
  @Max(5, { message: 'Điểm đánh giá không được lớn hơn 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comment phải là kiểu String' })
  comment: string;
}
