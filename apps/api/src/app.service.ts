import { Injectable } from '@nestjs/common';

import { OpenApiStateService } from './openapi/openapi-state.service';
import { OPENAPI_JSON_ROUTE, OPENAPI_UI_ROUTE } from './openapi/setup-openapi';

export interface HealthLinks {
  openapi: {
    url: string;
    header: string;
    tokenConfigured: boolean;
    requiresAuth: boolean;
  };
  swaggerUi: string;
}

export interface HealthStatus {
  status: 'ok';
  uptime: number;
  timestamp: string;
  checks: {
    openapi: {
      status: 'pass' | 'warn';
      version: string | null;
      generatedAt: string | null;
      tags: string[];
      requiresAuth: boolean;
      tokenConfigured: boolean;
    };
  };
  links: HealthLinks;
}

@Injectable()
export class AppService {
  constructor(private readonly openApiState: OpenApiStateService) {}

  getHealth(): HealthStatus {
    const snapshot = this.openApiState.snapshot();
    const accessControl = this.openApiState.getAccessControl();
    const ready = this.openApiState.isReady();

    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        openapi: {
          status: ready ? 'pass' : 'warn',
          version: snapshot.version,
          generatedAt: snapshot.generatedAt,
          tags: snapshot.tags,
          requiresAuth: accessControl.requiresAuth,
          tokenConfigured: accessControl.tokenConfigured
        }
      },
      links: {
        openapi: {
          url: OPENAPI_JSON_ROUTE,
          header: accessControl.headerName,
          tokenConfigured: accessControl.tokenConfigured,
          requiresAuth: accessControl.requiresAuth
        },
        swaggerUi: OPENAPI_UI_ROUTE
      }
    };
  }
}
