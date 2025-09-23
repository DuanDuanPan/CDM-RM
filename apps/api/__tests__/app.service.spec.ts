import { AppService } from '../src/app.service';

describe('AppService', () => {
  it('返回健康检查结果', () => {
    const service = new AppService();

    const result = service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
    expect(Date.parse(result.timestamp)).not.toBeNaN();
  });
});
