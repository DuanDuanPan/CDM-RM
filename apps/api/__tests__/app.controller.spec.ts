import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (集成测试)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health 返回 200 与健康状态', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.checks.openapi).toMatchObject({
      requiresAuth: false,
      tokenConfigured: false
    });
    expect(response.body.links).toMatchObject({
      openapi: {
        url: '/api/__openapi.json',
        header: 'x-openapi-key',
        requiresAuth: false,
        tokenConfigured: false
      },
      swaggerUi: '/api/docs'
    });
  });
});
