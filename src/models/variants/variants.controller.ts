import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ResponseMessage } from 'src/common/decorators/response.decorator';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @ResponseMessage('Tạo mới một biến thể cho sản phẩm')
  @Post()
  async create(@Body() createVariantDto: CreateVariantDto, @User() user: IUser) {
    return await this.variantsService.create(createVariantDto, user);
  }

  @ResponseMessage('Lấy danh sách biến thể với phân trang')
  @Get()
  async findAll(@Query() query: string) {
    return await this.variantsService.findAll(query);
  }

  @ResponseMessage('Lấy thông tin biến thể')
  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) _id: string) {
    return await this.variantsService.findOne(_id);
  }

  @ResponseMessage('Cập nhật mới thông tin biến thể')
  @Patch(':id')
  async update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updateVariantDto: UpdateVariantDto,
    @User() user: IUser,
  ) {
    return await this.variantsService.update(_id, updateVariantDto, user);
  }

  @ResponseMessage('Xóa một biến thể của sản phẩm')
  @Delete(':id')
  async remove(@Param('id', ValidateObjectIdPipe) _id: string, @User() user: IUser) {
    return await this.variantsService.remove(_id, user);
  }
}
