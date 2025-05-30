import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';
import { UploadService } from 'src/upload/upload.service';

@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly uploadService: UploadService,
  ) { }

  @Post()
  create(@Body() body: ItemDto) {
    return this.itemService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: ItemDto) {
    return this.itemService.update(+id, body);
  }

  @Post('detect')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload ảnh quần áo để detect' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const ext = extname(file.originalname) || '.png';
    const uniqueName = uuidv4() + ext;
    const result = await this.itemService.detectClothingAfterUpload(uniqueName, file.buffer);
    return result;
  }
}
