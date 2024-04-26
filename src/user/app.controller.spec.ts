import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './module/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users/:id (GET)', async () => {
    const userId = 1;
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('first_name');
        expect(res.body).toHaveProperty('last_name');
        expect(res.body).toHaveProperty('avatar');
      });
  });

  it('/users (POST)', async () => {
    const userData = {
      name: 'John Doe',
      job: 'bricklayer',
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', userData.name);
        expect(res.body).toHaveProperty('job', userData.job);
      });
  });

  it('/users/:userId/avatar (GET)', async () => {
    const userId = 1;
    await request(app.getHttpServer())
      .get(`/users/${userId}/avatar`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('/users/:id/avatar (DELETE)', async () => {
    const userId = 1;
    await request(app.getHttpServer())
      .delete(`/users/${userId}/avatar`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'message',
          `Avatar for id ${userId} deleted successfully`,
        );
      });
  });
});
