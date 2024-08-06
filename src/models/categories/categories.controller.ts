import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/interfaces/user.interface';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { Public } from 'src/auth/auth.decorator';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate_object_id.pipe';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ResponseMessage('Tạo mới danh mục')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @User() user: IUser) {
    return await this.categoriesService.create(createCategoryDto, user);
  }

  @Public()
  @ApiParam({
    name: 'qs',
    required: false,
    type: String,
    example: 'current=1&pageSize=2&name=Quần&sort=createdAt',
    description: 'Build query string để thực hiện phân trang, tìm kiếm, sắp xếp',
  })
  @ResponseMessage('Lấy danh sách danh mục')
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @ResponseMessage('Lấy thông tin của danh mục')
  @Get(':id')
  async findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return await this.categoriesService.findOne(id);
  }

  @ResponseMessage('Cập nhật thông tin danh mục')
  @Patch(':id')
  async update(
    @Param('id', ValidateObjectIdPipe) _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: IUser,
  ) {
    return await this.categoriesService.update(_id, updateCategoryDto, user);
  }

  @ResponseMessage('Xóa danh mục')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.categoriesService.remove(id, user);
  }
}
