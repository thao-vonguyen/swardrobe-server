import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ItemModule } from './item/item.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';

@Module({
  imports: [UserModule, PrismaModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/register', method: RequestMethod.POST }, // register
        { path: 'items/detect', method: RequestMethod.POST },
      )
      .forRoutes('*'); // hoặc chỉ định cụ thể path/module nào
  }
}
