import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ReqResService } from '../services/request.service';
import { CreateUserDto } from '../dto/createuser.dto';

@Controller('users')
export class AppController {
  constructor(private reqResService: ReqResService) {}

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.reqResService.getUser(id);
  }

  @Post('')
  createUser(@Body() userData: CreateUserDto) {
    return this.reqResService.createUser(userData);
  }

  @Get(':userId/avatar')
  getAvatar(@Param('userId') userId: number) {
    return this.reqResService.getAvatar(userId);
  }

  @Delete(':userId/avatar')
  deleteAvatar(@Param('userId') userId: number) {
    return this.reqResService.deleteAvatar(userId);
  }
}
