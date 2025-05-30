import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
    @ApiProperty({ example: 'Áo hoodie local brand' })
    name: string;

    @ApiProperty({ example: ['https://example.com/image1.jpg'], type: [String] })
    image: string[];

    @ApiProperty({ example: ['Hoodie'], type: [String] })
    category: string[];

    @ApiProperty({ example: ['#000000', '#FFFFFF'], type: [String] })
    color: string[];

    @ApiProperty({ example: 1 })
    user_id: number;
}
