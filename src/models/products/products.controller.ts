import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Version } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { Product } from './schemas/product.schema';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { Public } from 'src/auth/auth.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Version('2')
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @User() user: IUser): Promise<Product> {
    return await this.productsService.create(createProductDto, user);
  }

  @Get()
  @Public()
  async findAll(@Query() query: string) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) _id: string) {
    return await this.productsService.findOne(_id);
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser,
  ) {
    return await this.productsService.update(_id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ValidateObjectIdPipe) _id: string, @User() user: IUser) {
    return this.productsService.remove(_id, user);
  }
}
