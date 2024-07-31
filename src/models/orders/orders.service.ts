import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartItem } from '../carts/schemas/cart-item.schema';
import { OrderSummary } from 'src/common/interfaces/order-summary.interface';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PromotionsService } from '../promotions/promotions.service';
import { Promotion } from '../promotions/schemas/promotion.schema';
import { AddressesService } from '../addresses/addresses.service';
import { Address } from '../addresses/schemas/address.schema';
import aqp from 'api-query-params';
import { IUser } from 'src/common/interfaces/user.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    private readonly promotionsService: PromotionsService,
    private readonly addressesService: AddressesService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    return await this.orderModel.create({
      user: userId,
      ...createOrderDto,
    });
  }

  async findAll(query: string) {
    const { filter, sort, population } = aqp(query);
    const current = +filter.current;
    const pageSize = +filter.pageSize;
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let limit = pageSize ? pageSize : 10;

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);
    const defaultSort = sort ? (sort as unknown as string) : '-createdAt';

    const result = await this.orderModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(defaultSort)
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    return await this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, user: IUser) {
    return await this.orderModel
      .updateOne(
        { _id: id },
        {
          ...updateOrderDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      )
      .exec();
  }

  async remove(id: string, user: IUser) {
    await this.orderModel
      .updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      )
      .exec();
    return await this.orderModel.softDelete({ _id: id });
  }

  getOrderSummary(cartItems: CartItem[], promotion?: Promotion, address?: Address): OrderSummary {
    const totalAmount = this.calculateTotalAmount(cartItems);

    const taxes = totalAmount * 0.15;

    const couponDiscount = promotion
      ? this.promotionsService.calculateDiscountAmount(totalAmount, promotion)
      : 0;

    const shippingCost = address
      ? this.addressesService.calculateShippingCost(address.province)
      : 0;

    const subTotal = totalAmount;

    const total = subTotal + taxes + shippingCost - couponDiscount;

    return {
      itemCount: cartItems.length,
      taxes,
      couponDiscount,
      shippingCost,
      subTotal,
      total,
    };
  }

  private calculateTotalAmount(cartItems: CartItem[]): number {
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    const totalAmount = cartItems.reduce((total, cartItem) => {
      const { quantity, variant } = cartItem;
      const { product } = variant;
      const itemPrice = product.price;

      return total + quantity * itemPrice;
    }, 0);

    return totalAmount;
  }
}
