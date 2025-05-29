import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/auth/public.decorator';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public() // Đánh dấu route này là công khai, không cần xác thực
  @Post('register')
  create(@Body() body: UserDto) {
    return this.userService.create(body);
  }

  @Public() // Đánh dấu route này là công khai, không cần xác thực
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
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
