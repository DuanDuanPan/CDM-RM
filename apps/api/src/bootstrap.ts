import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupOpenApi } from './openapi/setup-openapi';

export async function createApp() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.enableShutdownHooks();

  return app;
}

export async function bootstrap() {
  const app = await createApp();
  await app.init();
  await setupOpenApi(app);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);

  const url = `http://localhost:${port}`;
  Logger.log(`API 服务已启动: ${url}`, 'Bootstrap');
  Logger.log(`Swagger UI: ${url}/api/docs`, 'Bootstrap');
  Logger.log(`OpenAPI JSON: ${url}/api/__openapi.json`, 'Bootstrap');
}
