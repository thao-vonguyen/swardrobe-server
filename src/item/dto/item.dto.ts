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

export class PredictionDto {
    @ApiProperty({ example: 378 })
    x: number;

    @ApiProperty({ example: 500 })
    y: number;

    @ApiProperty({ example: 692 })
    width: number;

    @ApiProperty({ example: 702 })
    height: number;

    @ApiProperty({ example: 0.9032418727874756 })
    confidence: number;

    @ApiProperty({ example: 'Shirt' })
    class: string;

    @ApiProperty({ example: 10 })
    class_id: number;

    @ApiProperty({ example: '9945ad03-e917-4494-afdd-b3ba49f56119' })
    detection_id: string;
}

export class ItemDetectResponseDto {
    @ApiProperty({
        type: [PredictionDto],
        example: [
            {
                x: 378,
                y: 500,
                width: 692,
                height: 702,
                confidence: 0.9032418727874756,
                class: 'Shirt',
                class_id: 10,
                detection_id: '9945ad03-e917-4494-afdd-b3ba49f56119',
            },
        ],
    })
    prediction: PredictionDto[];

    @ApiProperty({
        example:
            'https://swardrobe.s3.ap-southeast-2.amazonaws.com/no-bg-8cc4c12c-18c8-44fc-b4ee-46f346c74234.png',
    })
    image_uri: string;

    @ApiProperty({
        type: [String],
        example: ['#053c34', '#041412', '#325f57', '#345454', '#042414'],
    })
    dominantColors: string[];
}