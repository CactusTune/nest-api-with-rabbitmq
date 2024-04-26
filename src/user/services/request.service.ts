import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.model';
import { CreateUserDto } from '../dto/createuser.dto';
import { AppService } from './app.service';
import { Image, ImageDocument } from '../model/image.model';
import { createHash } from 'crypto';

@Injectable()
export class ReqResService {
  private baseUrl: string;
  private readonly logger = new Logger(ReqResService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private appService: AppService,
  ) {
    this.baseUrl = process.env.REQRES_API_URL;
  }

  async getUser(id: number): Promise<any> {
    console.log('got here');
    console.log(this.baseUrl);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${id}`),
      );
      await this.appService.publishEvent('user_fetched', { user_id: id });
      return response.data.data;
    } catch (error) {
      throw new HttpException('Failed to fetch user', HttpStatus.BAD_GATEWAY);
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const user = new this.userModel(data);
      await user.save();

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/users`, data),
      );

      this.logger.log('User created and saved to database.');
      this.logger.log(
        `Response from external API: ${JSON.stringify(response.data)}`,
      );

      await this.appService.publishEvent('user_created', { user_id: user.id });

      return user;
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.BAD_GATEWAY);
    }
  }

  async getAvatar(UserId: number): Promise<any> {
    try {
      const existingImage = await this.imageModel
        .findOne({ userId: UserId })
        .exec();
      if (existingImage) {
        await this.appService.publishEvent('avatar_fetched', {
          user_id: UserId,
        });
        return existingImage.data;
      }

      const response = await this.getUser(UserId);
      const imageData = Buffer.from(response.avatar).toString('base64');
      const user_id = response.id;
      const imageHash = createHash('sha256').update(imageData).digest('hex');

      const newImage = new this.imageModel({
        userId: user_id,
        hash: imageHash,
        data: imageData,
      });
      await newImage.save();

      await this.appService.publishEvent('avatar_fetched', {
        user_id: user_id,
      });

      return imageData;
    } catch (error) {
      this.logger.error('Failed to fetch or save avatar:', error);
      throw new HttpException('Failed to fetch avatar', HttpStatus.BAD_GATEWAY);
    }
  }

  async deleteAvatar(userId: number) {
    try {
      const existingImage = await this.imageModel
        .findOne({ userId: userId })
        .exec();

      if (!existingImage) {
        throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
      }

      await this.imageModel.deleteOne({ userId: userId }).exec();

      await this.appService.publishEvent('avatar_deleted', { user_id: userId });

      this.logger.log(`Avatar for user ${userId} deleted successfully.`);
      return { message: `Avatar for id ${userId} deleted successfully` };
    } catch (error) {
      this.logger.error('Failed while deleting avatar:', error);
      throw new HttpException(
        'Failed to delete avatar',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
