import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ItemService {
    private readonly API_KEY = 'ZA3Rip32FuiLPZNbkJDR';
    private readonly MODEL_URL = 'https://serverless.roboflow.com/clothing-detection-s4ioc/6';
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.item.create({ data });
    }

    findOne(id: number) {
        return this.prisma.item.findUnique({ where: { id } });
    }

    update(id: number, data: any) {
        return this.prisma.item.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.item.delete({ where: { id } });
    }

    async detectClothing(imageName: string): Promise<any> {
        const imagePath = path.join(__dirname, '..', '..', 'images', imageName);
        const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

        try {
        const response = await axios.post(this.MODEL_URL, base64Image, {
            params: { api_key: this.API_KEY },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data;
        } catch (error) {
        console.error('❌ Lỗi gọi Roboflow API:', error.message);
        throw error;
        }
    }
}
