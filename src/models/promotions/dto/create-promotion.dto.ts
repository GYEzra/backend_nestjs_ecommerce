import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouponStatus, DiscountType } from 'src/common/enums/enums';

export class CreatePromotionDto {
  @IsNotEmpty({ message: 'Mã khuyến mãi không được bỏ trống' })
  @IsString({ message: 'Mã khuyến mãi phải là kiểu String' })
  coupon: string;

  @IsNotEmpty({ message: 'Trạng thái không được bỏ trống' })
  @IsEnum(CouponStatus, { message: 'Trạng thái không hợp lệ (Active, Inactive, Expired)' })
  status: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là kiểu String' })
  description?: string;

  @IsNotEmpty({ message: 'Số tiền giảm giá không được bỏ trống' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { message: 'Số tiền giảm giá không hợp lệ' },
  )
  @Min(0, { message: 'Số tiền giảm giá tối thiểu là 0 VND' })
  @Max(500000000, { message: 'Số tiền giảm giá tối đa là 500.000.000 VND' })
  discount_amount: number;

  @IsNotEmpty({ message: 'Miễn phí vận chuyển không được bỏ trống' })
  @IsBoolean({ message: 'Miễn phí vận chuyển phải là kiểu Boolean ' })
  free_shipping: boolean;

  @IsNotEmpty({ message: 'Loại giảm giá không được bỏ trống' })
  @IsEnum(DiscountType, { message: 'Loại giảm giá không hợp lệ (Percentage, Fixed_amount)' })
  discount_type: string;

  @IsOptional()
  condition: number; // Điều kiện là tổng giá trị đơn hàng - (Mở rộng: Minimum_purchase, Specific_products, Customer_group)

  @IsNotEmpty({ message: 'Ngày bắt đầu không được bỏ trống' })
  @IsDate({ message: 'Ngày bắt đầu phải là kiểu Date' })
  @Type(() => Date)
  start_date: Date;

  @IsNotEmpty({ message: 'Ngày kết thúc không được bỏ trống' })
  @IsDate({ message: 'Ngày kết thúc phải là kiểu Date' })
  @Type(() => Date)
  end_date: Date;
}
