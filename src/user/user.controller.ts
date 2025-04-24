import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() body: UserDto) {
    return this.userService.create(body);
  }

  @Patch(':id') // Sử dụng PATCH để cập nhật dữ liệu
  update(@Param('id') id: string, @Body() body: UserDto) {
    return this.userService.update(+id, body); // gọi phương thức update trong UserService
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
