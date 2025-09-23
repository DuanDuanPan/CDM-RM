import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}
