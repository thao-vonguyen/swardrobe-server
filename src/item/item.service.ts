import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import getColors from 'get-image-colors';
import { removeBackgroundFromImageFile } from 'remove.bg';

@Injectable()
export class ItemService {
    private readonly API_KEY = 'ZA3Rip32FuiLPZNbkJDR';
    private readonly MODEL_URL = 'https://serverless.roboflow.com/clothing-detection-s4ioc/6';
    private readonly REMOVE_BG_KEY = '6ZpgC1wjpqDLQvFwMUURAZbZ';
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

    private async getDominantColors(imagePath: string): Promise<string[]> {
        const colors = await getColors(imagePath); // tự đoán loại file từ extension
        return colors.map(color => color.hex());
    }

    async detectClothing(imageName: string): Promise<any> {
        const imageBaseName = path.parse(imageName).name; // 👉 lấy phần tên không có đuôi
        const imagePath = path.join(__dirname, '..', '..', 'images', imageName);
        const noBgName = `no-bg-${imageBaseName}.png`; // ✅ tên chuẩn cho ảnh tách nền
        const noBgPath = path.join(__dirname, '..', '..', 'images', noBgName);

        try {
            // Bước 1: Tách nền trước
            await removeBackgroundFromImageFile({
                path: imagePath,
                apiKey: this.REMOVE_BG_KEY,
                size: 'auto',
                type: 'auto',
                outputFile: noBgPath,
            });

            // Bước 2: Encode ảnh đã tách nền sang base64 để gửi Roboflow
            const base64Image = fs.readFileSync(noBgPath, { encoding: 'base64' });

            // Bước 3: Gửi Roboflow predict
            const detectionRes = await axios.post(this.MODEL_URL, base64Image, {
                params: { api_key: this.API_KEY },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const prediction = detectionRes.data.predictions[0];
            if (!prediction) throw new Error('Không phát hiện được quần áo nào');

            // Bước 4: Lấy màu chủ đạo
            const hexColors = await this.getDominantColors(noBgPath);

            return {
                prediction,
                no_bg_image: `no-bg-${imageName}`,
                dominantColors: hexColors,
            };
        } catch (error) {
            console.error('❌ Lỗi xử lý ảnh:', error.message);
            throw error;
        }
    }

    findAll(user_id: string) {
        return this.prisma.item.findMany(
            {
                where: { user_id: Number(user_id) },
            }
        );
    }
}
