import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import './config/env';
import { OpenApiStateService } from './openapi/openapi-state.service';

@Module({
  controllers: [AppController],
  providers: [AppService, OpenApiStateService]
})
export class AppModule {}
