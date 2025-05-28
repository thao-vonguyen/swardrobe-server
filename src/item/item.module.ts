import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule { }
