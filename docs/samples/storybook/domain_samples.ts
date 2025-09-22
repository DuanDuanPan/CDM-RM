// Domain-specific Storybook sample data — Aerospace Engine (v0.16)

export type ID = string;

export interface KpiCard { key: string; label: string; value: number; unit?: string; trend?: 'up'|'down'|'flat'; }
export const kpiCards: KpiCard[] = [
  { key: 'thrust_pass', label: '起飞推力达标率', value: 92.5, unit: '%', trend: 'up' },
  { key: 'tsfc_pass', label: '巡航 TSFC 达标率', value: 88.0, unit: '%', trend: 'up' },
  { key: 'emission_items', label: '排放达标项', value: 4, unit: '项', trend: 'flat' },
  { key: 'ground_test_pass', label: '地面试车通过率', value: 82.0, unit: '%', trend: 'down' }
];

// i18n-aware KPI variant (labels by i18n keys instead of literal strings)
export interface KpiCardI18n { key: string; labelKey: string; value: number; unitKey?: string; trend?: 'up'|'down'|'flat'; }
export const kpiCardsI18n: KpiCardI18n[] = [
  { key: 'thrust_pass', labelKey: 'kpi.thrust_pass_rate', value: 92.5, unitKey: 'fmt.percent', trend: 'up' },
  { key: 'tsfc_pass', labelKey: 'kpi.tsfc_pass_rate', value: 88.0, unitKey: 'fmt.percent', trend: 'up' },
  { key: 'emission_items', labelKey: 'kpi.emission_items', value: 4 },
  { key: 'ground_test_pass', labelKey: 'kpi.ground_test_pass_rate', value: 82.0, unitKey: 'fmt.percent', trend: 'down' }
];

export interface RequirementRow { id: ID; category: 'FR'|'PR'|'IR'|'TR'|'XR'|'OR'; title: string; status: 'new'|'in_review'|'approved'|'deprecated'; moduleId: ID; baselineId: ID; }
export const requirementRows: RequirementRow[] = [
  { id: 'REQ-ENG-0001', category: 'PR', title: '最大起飞推力 ≥120 kN', status: 'approved', moduleId: 'MOD-ENGINE-01', baselineId: 'BL-0001' },
  { id: 'REQ-ENG-0002', category: 'PR', title: '巡航 TSFC ≤0.62', status: 'in_review', moduleId: 'MOD-ENGINE-01', baselineId: 'BL-0001' },
  { id: 'REQ-ENG-TR-0001', category: 'TR', title: '怠速→起飞 加速≤5 s', status: 'approved', moduleId: 'MOD-ENGINE-CTRL', baselineId: 'BL-0001' },
  { id: 'REQ-ENG-IR-0001', category: 'IR', title: 'ARINC429/AFDX 接口', status: 'in_review', moduleId: 'MOD-ENGINE-IF', baselineId: 'BL-0001' },
  { id: 'REQ-ENG-XR-REL-0001', category: 'XR', title: 'MTBF ≥1000 h', status: 'approved', moduleId: 'MOD-ENGINE-RAMT', baselineId: 'BL-0001' }
];

// Column header i18n keys for requirements table
export const requirementColumnsI18n = [
  'col.id', 'col.category', 'col.title', 'col.status', 'col.module', 'col.baseline', 'col.updatedAt'
];

export interface MetricPoint { id: ID; name: string; unit: string; value: number; requirementId: ID; }
export const metricPoints: MetricPoint[] = [
  { id: 'MET-ENG-THRUST-TO', name: '最大起飞推力', unit: 'kN', value: 122.0, requirementId: 'REQ-ENG-0001' },
  { id: 'MET-ENG-TSFC-CRUISE', name: '巡航 TSFC', unit: 'kg/(kN·h)', value: 0.58, requirementId: 'REQ-ENG-0002' },
  { id: 'MET-ENG-T4', name: 'T4', unit: 'K', value: 1720, requirementId: 'REQ-ENG-0004' },
  { id: 'MET-ENG-NOx', name: 'NOx', unit: 'g/kN', value: 14.0, requirementId: 'REQ-ENG-0003' },
  { id: 'MET-ENG-THROTTLE-RESP', name: '加速响应', unit: 's', value: 4.6, requirementId: 'REQ-ENG-TR-0001' }
];

export interface JobStep { name: string; status: 'pending'|'running'|'done'|'failed'; }
export interface Job { id: ID; type: 'import'|'extract'|'bind'|'export'; status: 'queued'|'running'|'waiting_input'|'failed'|'succeeded'|'canceled'; progress: number; steps: JobStep[] }
export const jobs: Job[] = [
  { id: 'JOB-IMP-ENG-0001', type: 'import', status: 'running', progress: 45, steps: [
    { name: 'upload', status: 'done' },
    { name: 'validate', status: 'done' },
    { name: 'parse', status: 'running' },
    { name: 'deduplicate', status: 'pending' },
    { name: 'preview', status: 'pending' },
    { name: 'write-baseline', status: 'pending' }
  ] }
];

export interface DiffItem { id: ID; severity: 'high'|'medium'|'low'; summary: string; objectId: ID; }
export const diffs: DiffItem[] = [
  { id: 'DIFF-ENG-0001', severity: 'high', summary: '推力目标 120→125 kN，评估风扇与低压级裕度', objectId: 'REQ-ENG-0001' }
];

export const rbomTree = [
  { id: 'PART-ENG-ROOT', name: '发动机总成', children: [
    { id: 'PART-FAN', name: '风扇（FAN）' },
    { id: 'PART-LPC', name: '低压压气机（LPC）' },
    { id: 'PART-HPC', name: '高压压气机（HPC）' },
    { id: 'PART-COMB', name: '燃烧室' },
    { id: 'PART-HPT', name: '高压涡轮（HPT）' },
    { id: 'PART-LPT', name: '低压涡轮（LPT）' },
    { id: 'PART-FADEC', name: 'FADEC 控制单元' }
  ]}
];

export default {
  kpiCards,
  requirementRows,
  metricPoints,
  jobs,
  diffs,
  rbomTree,
};
