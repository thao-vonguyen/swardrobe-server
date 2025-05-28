import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { ItemModule } from './item/item.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UserModule, PrismaModule, ItemModule, UploadModule],
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
