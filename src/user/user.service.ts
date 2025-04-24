import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.user.create({ data });
    }

    update(id: number, data: any) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
