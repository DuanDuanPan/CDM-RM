import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService, type HealthStatus } from './app.service';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '健康检查',
    description: '返回服务运行状态、OpenAPI JSON 与 Swagger UI 链接。'
  })
  getHealth(): HealthStatus {
    return this.appService.getHealth();
  }
}
