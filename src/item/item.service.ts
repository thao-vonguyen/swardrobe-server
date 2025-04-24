import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemService {
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
}
