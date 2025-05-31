import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ItemDetectResponseDto, ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) { }

  @Post()
  @ApiCreatedResponse({ type: ItemDto, description: 'Tạo item thành công' })
  create(@Body() body: ItemDto) {
    return this.itemService.create(body);
  }

  @Get(':id')
  @ApiOkResponse({ type: ItemDto, description: 'Lấy chi tiết item thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy item' })
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Cập nhật item thành công', schema: { example: { message: 'Cập nhật item thành công' } } })
  update(@Param('id') id: string, @Body() body: ItemDto) {
    return this.itemService.update(+id, body);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Xóa item thành công', schema: { example: { message: 'Xóa item thành công' } } })
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  @Post('detect')
  @ApiCreatedResponse({
    description: 'Ảnh đã được xử lý, phát hiện quần áo và trả về thông tin',
    schema: {
      example: {
        prediction: [
          {
            x: 378,
            y: 500,
            width: 692,
            height: 702,
            confidence: 0.9032418727874756,
            class: 'Shirt',
            class_id: 10,
            detection_id: '9945ad03-e917-4494-afdd-b3ba49f56119'
          }
        ],
        image_uri: 'https://swardrobe.s3.ap-southeast-2.amazonaws.com/no-bg-8cc4c12c-18c8-44fc-b4ee-46f346c74234.png',
        dominantColors: [
          '#053c34',
          '#041412',
          '#325f57',
          '#345454',
          '#042414'
        ]
      }
    }
  })
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
  @ApiResponse({
    status: 201,
    description: 'Successfully detected item from image',
    type: ItemDetectResponseDto,
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

  @ApiOkResponse({ type: [ItemDto] })
  @Get('my/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.itemService.findAll(user_id);
  }
}
