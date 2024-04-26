import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReqResService } from '../services/request.service';
import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from '../model/user.model';
import { Image, ImageSchema } from '../model/image.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ReqResService],
})
export class AppModule {}
