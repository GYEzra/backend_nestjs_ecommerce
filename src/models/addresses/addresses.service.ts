import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: SoftDeleteModel<AddressDocument>,
  ) {}

  async create(createShippingAddressDto: CreateAddressDto) {
    return await this.addressModel.create(createShippingAddressDto);
  }

  async findAllByUser(userId: string) {
    return await this.addressModel.find({ user: userId });
  }

  async update(_id: string, updateShippingAddressDto: UpdateAddressDto) {
    return await this.addressModel.updateOne({ _id }, { ...updateShippingAddressDto });
  }

  async remove(_id: string) {
    return await this.addressModel.softDelete({ _id });
  }

  calculateShippingCost(province: string): number {
    return province === 'TPHCM' ? 20000 : 50000; // Tích hợp Google Map
  }
}
