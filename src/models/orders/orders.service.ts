import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { PromotionsService } from '../promotions/promotions.service';
import { AddressesService } from '../addresses/addresses.service';
import aqp from 'api-query-params';
import { IUser } from 'src/common/interfaces/user.interface';
import { CartsService } from '../carts/carts.service';
import { OrderStatus } from 'src/common/enums/status.enum';
import { PaymentStatus } from 'src/common/enums/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    private readonly promotionsService: PromotionsService,
    private readonly addressesService: AddressesService,
    private readonly cartService: CartsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { cartId, payment_method, note } = createOrderDto;

    const cart = await this.cartService.findOne(cartId);

    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

    const orderData = this.calculateOrderData(cart);

    const newOrder = await this.orderModel.create({
      ...orderData,
      user: cart.user,
      payment_method,
      payment_status: PaymentStatus.Pending,
      note,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    await this.cartService.remove(cartId);

    return newOrder;
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
        current,
        pageSize,
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
    return await this.orderModel.updateOne(
      { _id: id },
      {
        ...updateOrderDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
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

  private calculateOrderData(cart: any) {
    const taxRate = 10 / 100;
    const subTotal = this.calculateTotalAmount(cart.items);
    const shippingCost = this.addressesService.calculateShippingCost(
      cart.shipping_address.province,
    );
    const discountAmount = this.promotionsService.calculateDiscountAmount(subTotal, cart.promotion);
    const taxAmount = subTotal * taxRate;
    const totalAmount = subTotal + taxAmount + shippingCost - discountAmount;

    return {
      items: cart.items,
      customer_full_name: cart.shipping_address.fullName,
      customer_phone_number: cart.shipping_address.phoneNumber,
      order_status: OrderStatus.Pending,
      counpon: cart.promotion?.coupon,
      discount_amount: cart.promotion?.discount_amount,
      shipping_address: cart.shipping_address.streetAddress + ', ' + cart.shipping_address.province,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    };
  }

  private calculateTotalAmount(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
