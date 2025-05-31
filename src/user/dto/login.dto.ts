import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'password123' })
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'Login successful' })
    message: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;
}
