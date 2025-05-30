import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 'Nguyễn Văn A' })
    full_name: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: '0123456789' })
    phone: string;

    @ApiProperty({ example: '1990-01-01', required: false, type: String, format: 'date' })
    date_of_birth?: string;

    @ApiProperty({ example: '123456' })
    password: string;
}

export class UserResponseDto {
    @ApiProperty({ example: 14 })
    id: number;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    full_name: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;
}

export class UserGetResponseDto {
    @ApiProperty({ example: 14 })
    id: number;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    full_name: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: '0123456789' })
    phone: string;

    @ApiProperty({ example: '1990-01-01', type: String, format: 'date', required: false })
    date_of_birth?: string;
}

