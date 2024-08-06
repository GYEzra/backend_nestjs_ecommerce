import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/common/interfaces/user.interface';
import { Cart, CartDocument } from './schemas/cart.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PromotionsService } from '../promotions/promotions.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>,
    private readonly promotionService: PromotionsService,
    private readonly addressService: AddressesService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    return await this.cartModel.create(createCartDto);
  }

  async findOne(id: string) {
    return await this.cartModel.findById(id).populate('address').populate('promotion').exec();
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    return this.cartModel.updateOne(
      { _id: id },
      {
        items: updateCartDto.items,
      },
    );
  }

  async remove(id: string) {
    return await this.cartModel.softDelete({ _id: id });
  }

  async applyPromotion(id: string, code: string | null) {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    if (code) {
      const totalAmount = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      );
      const promotion = await this.promotionService.checkPromotion(code, totalAmount);

      await this.cartModel.updateOne({ _id: id }, { promotionCode: promotion.code });
      return promotion;
    } else {
      await this.cartModel.updateOne({ _id: id }, { promotionCode: null });
      return null;
    }
  }

  async appyAddress(id: string, addressId: string | null) {
    const cart = await this.cartModel.findById(id);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    if (addressId) {
      const address = await this.addressService.findOne(addressId);
      if (!address) {
        throw new NotFoundException('Không tìm thấy địa chỉ nhận hàng');
      }

      await this.cartModel.updateOne({ _id: id }, { shippingAddress: addressId });
      return address;
    } else {
      await this.cartModel.updateOne({ _id: id }, { shippingAddress: null });
      return null;
    }
  }
}
