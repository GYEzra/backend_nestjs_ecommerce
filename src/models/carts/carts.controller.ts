import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApplyPromotionDto } from '../promotions/dto/apply-promotion.dto';
import { ApplyAddressDto } from '../addresses/dto/apply-address.dto';
import { Public } from 'src/auth/auth.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ResponseMessage('Tạo mới giỏ hàng')
  async create(@Body() createCartDto: CreateCartDto) {
    return await this.cartsService.create(createCartDto);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin giỏ hàng')
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.cartsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật giỏ hàng')
  update(@Param('id', ValidateObjectIdPipe) id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(id, updateCartDto);
  }

  @Post(':id/promotions')
  @ResponseMessage('Áp dụng mã giảm giá')
  async applyCoupon(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() applyPromotionDto: ApplyPromotionDto,
  ) {
    return await this.cartsService.applyPromotion(id, applyPromotionDto.coupon);
  }

  @Public()
  @ResponseMessage('Áp dụng địa chỉ nhận hàng')
  @Post(':id/addresses')
  async applyAddress(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() applyAddressDto: ApplyAddressDto,
  ) {
    return await this.cartsService.appyAddress(id, applyAddressDto.addressId);
  }
}
