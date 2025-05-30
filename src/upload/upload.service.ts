import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { lookup as mimeLookup } from 'mime-types';

@Injectable()
export class UploadService {
    private s3Client: S3Client;
    private readonly bucketName = process.env.AWS_S3_BUCKET;
    
    constructor() {
        this.s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        });
    }

    async upload(fileName: string, file: Buffer): Promise<string> {
        const contentType = mimeLookup(fileName) || 'application/octet-stream';

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: file,
                ContentType: contentType,
            }),
        )
        return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }
}
