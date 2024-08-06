import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('Tạo mới đơn hàng')
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return await this.ordersService.create(createOrderDto, user);
  }

  @ApiParam({
    name: 'qs',
    required: false,
    type: String,
    example:
      'current=1&pageSize=2&populate=user&fields=fullname&total_amount=200000&sort=createdAt',
    description:
      'Build query string để thực hiện phân trang, tìm kiếm, sắp xếp, lấy thêm dữ liệu từ Related documents',
  })
  @Get()
  @ResponseMessage('Lấy danh sách đơn hàng')
  findAll(@Query() query: string) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đơn hàng')
  async findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin đơn hàng')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() user: IUser,
  ) {
    return this.ordersService.update(id, updateOrderDto, user);
  }
}
