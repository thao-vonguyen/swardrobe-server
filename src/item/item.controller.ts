import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';

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
}
