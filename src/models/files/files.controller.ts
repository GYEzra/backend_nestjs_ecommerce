import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { deleteFileFromDiskStorage, multerOptions } from 'src/config/multer.config';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Không có file để upload');

    return file.filename;
  }

  @Delete(':fileName')
  delete(@Param('fileName') fileName: string) {
    return deleteFileFromDiskStorage(fileName);
  }
}
