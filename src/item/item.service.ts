import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import getColors from 'get-image-colors';
import * as path from 'path';
import { removeBackgroundFromImageFile } from 'remove.bg';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import FormData from 'form-data';


@Injectable()
export class ItemService {
    constructor(private prisma: PrismaService, private readonly uploadService: UploadService,) { }

    create(data: any) {
        const requiredFields = ['name', 'image', 'category', 'color', 'user_id'];

        for (const field of requiredFields) {
            if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
                throw new Error(`Field ${field} is required and cannot be empty.`);
            }
        }
        return this.prisma.item.create({ data });
    }

    findOne(id: number) {
        return this.prisma.item.findUnique({ where: { id } });
    }

    // update
    async update(id: number, data: any) {
        await this.prisma.item.update({ where: { id }, data });
        return { message: 'Cập nhật item thành công' };
    }

    // remove
    async remove(id: number) {
        await this.prisma.item.delete({ where: { id } });
        return { message: 'Xóa item thành công' };
    }


    private async getDominantColors(imagePath: string): Promise<string[]> {
        const colors = await getColors(imagePath); // tự đoán loại file từ extension
        return colors.map(color => color.hex());
    }

    async detectClothingAfterUpload(imageName: string, buffer: Buffer): Promise<any> {
        const imageBaseName = path.parse(imageName).name;
        const tempDir = path.join(__dirname, '..', '..', 'temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const imagePath = path.join(tempDir, imageName);
        const noBgName = `no-bg-${imageBaseName}.png`;
        const noBgPath = path.join(tempDir, noBgName);

        try {
            // 1. Lưu ảnh gốc
            fs.writeFileSync(imagePath, buffer);

            // 2. Gửi ảnh tới ClipDrop để tách nền
            const form = new FormData();
            form.append('image_file', buffer, imageName);

            const response = await axios.post('https://clipdrop-api.co/remove-background/v1', form, {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API_KEY,
                    ...form.getHeaders(),
                },
                responseType: 'arraybuffer', // để nhận về binary image
            });

            // 3. Ghi ảnh tách nền vào file
            fs.writeFileSync(noBgPath, Buffer.from(response.data));

            // 4. Encode base64 ảnh tách nền
            const base64Image = Buffer.from(response.data).toString('base64');

            // 5. Gửi đến Roboflow để detect
            const detectionRes = await axios.post(process.env.MODEL_URL, base64Image, {
                params: { api_key: process.env.API_KEY },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const prediction = detectionRes.data.predictions;

            // 6. Upload ảnh lên W3S
            const noBgUri = await this.uploadService.upload(noBgName, fs.readFileSync(noBgPath));

            // 7. Lấy màu chủ đạo
            const hexColors = await this.getDominantColors(noBgPath);

            return {
                prediction,
                image_uri: noBgUri,
                dominantColors: hexColors,
            };
        } catch (error) {
            console.error('❌ Lỗi xử lý ảnh:', error.message);
            throw error;
        } finally {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            if (fs.existsSync(noBgPath)) fs.unlinkSync(noBgPath);
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
