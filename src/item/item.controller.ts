import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Get()
  async detectClothing(@Query('image') imageName: string) {
    return this.itemService.detectClothing(imageName);
  }

  @Get('my/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.itemService.findAll(user_id);
  }
}
