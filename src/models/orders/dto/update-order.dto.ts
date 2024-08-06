import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/common/enums/status.enum';
import { PaymentStatus } from 'src/common/enums/enums';
import { CreateCartDto } from 'src/models/carts/dto/create-cart.dto';

export class UpdateOrderDto extends IntersectionType(
  PartialType(OmitType(CreateOrderDto, ['cartId'])),
  PartialType(OmitType(CreateCartDto, ['userId'])),
) {
  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên người nhận',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tên người nhận phải là kiểu String' })
  customer_full_name: string;

  @ApiProperty({
    example: '0901234567',
    description: 'Số điện thoại người nhận',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại người nhận phải là kiểu String' })
  customer_phone_number: string;

  @ApiProperty({
    example: '21/2 Hoàng Việt, Q.Tân Bình, TPHCM',
    description: 'Địa chỉ người nhận',
    required: false,
  })
  shipping_address: string;

  @ApiProperty({
    enum: OrderStatus,
    example: 'Đang xử lý',
    description: 'Trạng thái đơn hàng',
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Order Status không hợp lệ' })
  order_status: string;

  @ApiProperty({
    enum: PaymentStatus,
    example: 'Đã thanh toán',
    description: 'Trạng thái thanh toán',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Payment Status không hợp lệ' })
  payment_status: string;
}
