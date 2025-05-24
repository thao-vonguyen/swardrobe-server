import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(data: UserDto) {
        if (!data.email || !data.full_name || !data.password) {
            throw new BadRequestException('Missing required fields');
        }

        const emailExist = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (emailExist) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                full_name: data.full_name,
                gender: data.gender || 'M',
                email: data.email,
                date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
                password: hashedPassword,
            },
        });

        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
        };
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

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '1h', // thời gian sống của token
        });

        return {
            message: 'Login successful',
            access_token: token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
        };
    }
}
