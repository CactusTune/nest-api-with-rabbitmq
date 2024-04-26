import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private client: ClientProxy;

  async onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'nestjs_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async publishEvent(pattern: string, message: any) {
    try {
      await lastValueFrom(this.client.emit(pattern, message));
      this.logger.log(`Event published: ${pattern}`);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${pattern}`, error);
    }
  }
}
