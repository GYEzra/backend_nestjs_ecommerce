import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { query } from 'express';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';

@Controller('coupons')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto, @User() user: IUser) {
    return await this.promotionsService.create(createPromotionDto, user);
  }

  @Get()
  async findAll(@Query() query: string) {
    return await this.promotionsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) _id: string) {
    return await this.promotionsService.findOne(_id);
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @User() user: IUser,
  ) {
    return await this.promotionsService.update(_id, updatePromotionDto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ValidateObjectIdPipe) _id: string, user: IUser) {
    return await this.promotionsService.remove(_id, user);
  }
}
