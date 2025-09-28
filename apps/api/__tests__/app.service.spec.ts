import { AppService } from '../src/app.service';
import { OpenApiStateService } from '../src/openapi/openapi-state.service';

describe('AppService', () => {
  it('返回健康检查结果', () => {
    const openApiState = new OpenApiStateService();
    const service = new AppService(openApiState);

    const result = service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
    expect(Date.parse(result.timestamp)).not.toBeNaN();
    expect(result.links.openapi).toMatchObject({
      url: '/api/__openapi.json',
      header: 'x-openapi-key',
      requiresAuth: false,
      tokenConfigured: false
    });
    expect(result.links.swaggerUi).toBe('/api/docs');
  });
});
