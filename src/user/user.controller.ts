import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserGetResponseDto, UserResponseDto } from './dto/user.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { Public } from 'src/auth/public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public() // Đánh dấu route này là công khai, không cần xác thực
  @Post('register')
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({
    description: 'Tạo người dùng thành công',
    type: UserResponseDto,
  })
  create(@Body() body: UserDto) {
    return this.userService.create(body);
  }

  @Public() // Đánh dấu route này là công khai, không cần xác thực
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Đăng nhập thành công',
    type: LoginResponseDto,
  })
  async login(@Body() body: LoginDto) {
    return this.userService.login(body.email, body.password);
  }

  @Patch(':id') // Sử dụng PATCH để cập nhật dữ liệu
  @ApiOkResponse({ description: 'Cập nhật người dùng thành công' })
  update(@Param('id') id: string, @Body() body: UserDto) {
    return this.userService.update(+id, body); // gọi phương thức update trong UserService
  }

  @Get(':id')
  @ApiOkResponse({ type: UserGetResponseDto, description: 'Thông tin người dùng' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOkResponse({ schema: { example: { message: 'Xóa người dùng thành công' } } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
