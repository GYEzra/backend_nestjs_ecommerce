import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Body() createShippingAddressDto: CreateAddressDto) {
    return await this.addressesService.create(createShippingAddressDto);
  }

  @Get(':userId')
  async findAllByUser(@Param('userId', ValidateObjectIdPipe) userId: string) {
    return await this.addressesService.findAllByUser(userId);
  }

  @Patch(':id')
  async update(@Param('id') _id: string, @Body() updateShippingAddressDto: UpdateAddressDto) {
    return await this.addressesService.update(_id, updateShippingAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') _id: string) {
    return await this.addressesService.remove(_id);
  }
}
