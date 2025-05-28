import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

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

  // @Get()
  // async detectClothing(@Query('image') imageName: string) {
  //   return this.itemService.detectClothing(imageName);
  // }
  @Post('detect')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async detectByFile(@UploadedFile() file: any) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.itemService.detectClothing(file.filename);
  }

  @Get('my/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.itemService.findAll(user_id);
  }
}
