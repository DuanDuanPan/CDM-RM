import { Injectable } from '@nestjs/common';
import type { OpenAPIObject } from '@nestjs/swagger';

export interface OpenApiAccessControl {
  headerName: string;
  tokenConfigured: boolean;
  requiresAuth: boolean;
}

export interface OpenApiSnapshot {
  version: string | null;
  generatedAt: string | null;
  tags: string[];
}

@Injectable()
export class OpenApiStateService {
  private document: OpenAPIObject | null = null;
  private generatedAt: Date | null = null;
  private accessControl: OpenApiAccessControl = {
    headerName: 'x-openapi-key',
    tokenConfigured: false,
    requiresAuth: false
  };

  setDocument(document: OpenAPIObject): void {
    this.document = document;
    this.generatedAt = new Date();
  }

  setAccessControl(accessControl: OpenApiAccessControl): void {
    this.accessControl = accessControl;
  }

  getAccessControl(): OpenApiAccessControl {
    return this.accessControl;
  }

  getDocument(): OpenAPIObject | null {
    return this.document;
  }

  isReady(): boolean {
    return this.document !== null;
  }

  snapshot(): OpenApiSnapshot {
    return {
      version: this.document?.info?.version ?? null,
      generatedAt: this.generatedAt ? this.generatedAt.toISOString() : null,
      tags: (this.document?.tags ?? []).map((tag) => tag?.name).filter((name): name is string => Boolean(name))
    };
  }
}
