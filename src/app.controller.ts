import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { prisma } from './main';
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await prisma.user.findMany()
    // return this.appService.getHello();
  }
}
