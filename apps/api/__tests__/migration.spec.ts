import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

type TableRow = { tablename: string };
type IndexRow = { indexname: string };

describe('数据库迁移基线', () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 未设置，无法执行迁移验证测试');
  }

  const prisma = new PrismaClient();
  const coreTables = ['requirements', 'metrics', 'rbom_nodes', 'requirement_rbom_bindings'];

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('核心表应全部存在', async () => {
    const existing: string[] = [];

    for (const table of coreTables) {
      const rows = await prisma.$queryRaw<TableRow[]>`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename = ${table}
      `;

      if (rows.length > 0) {
        existing.push(rows[0].tablename);
      }
    }

    expect(existing.sort()).toEqual([...coreTables].sort());
  });

  it('关键索引已创建', async () => {
    const requirementIndexes = await prisma.$queryRaw<IndexRow[]>`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'requirements'
    `;

    const metricIndexes = await prisma.$queryRaw<IndexRow[]>`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'metrics'
    `;

    const rbomIndexes = await prisma.$queryRaw<IndexRow[]>`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'rbom_nodes'
    `;

    const requirementIndexNames = requirementIndexes.map((row: IndexRow) => row.indexname);
    expect(requirementIndexNames).toEqual(
      expect.arrayContaining([
        'idx_requirements_module_object_baseline',
        'idx_requirements_status',
        'requirements_dedupe_hash_key'
      ])
    );

    const metricIndexNames = metricIndexes.map((row: IndexRow) => row.indexname);
    expect(metricIndexNames).toEqual(expect.arrayContaining(['idx_metrics_requirement_id', 'idx_metrics_name']));

    const rbomIndexNames = rbomIndexes.map((row: IndexRow) => row.indexname);
    expect(rbomIndexNames).toEqual(expect.arrayContaining(['idx_rbom_nodes_code', 'uq_rbom_nodes_code_baseline_id']));
  });

  it('状态筛选查询命中索引', async () => {
    const requirementId = `req_${randomUUID()}`;
    const dedupeHash = `hash_${randomUUID()}`;

    await prisma.requirement.create({
      data: {
        id: requirementId,
        moduleId: 'mod-A',
        objectId: 'obj-1',
        baselineId: 'baseline-1',
        title: 'Index Check',
        content: 'Ensure index usage',
        status: 'draft',
        priority: 'P1',
        dedupeHash
      }
    });

    try {
      await prisma.$executeRawUnsafe('SET enable_seqscan = off');
      type ExplainPlan = { Plan: Record<string, unknown> };
      type ExplainResult = { 'QUERY PLAN': ExplainPlan[] };

      const plans = await prisma.$queryRaw<ExplainResult[]>`
        EXPLAIN (FORMAT JSON)
        SELECT id FROM requirements WHERE status = 'draft'
      `;
      const [firstPlan] = plans ?? [];
      const [planEntry] = firstPlan?.['QUERY PLAN'] ?? [];

      if (!planEntry) {
        throw new Error('无法解析 EXPLAIN 结果');
      }

      const rootPlan = planEntry.Plan as Record<string, unknown>;

      expect(String(rootPlan['Node Type'])).toContain('Index');
      expect(rootPlan['Index Name']).toBe('idx_requirements_status');
    } finally {
      await prisma.$executeRawUnsafe('SET enable_seqscan = on');
      await prisma.requirement.delete({ where: { id: requirementId } });
    }
  });
});
