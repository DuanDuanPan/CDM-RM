/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Verification = {
    id: string;
    requirementId?: string;
    metricId?: string;
    method: 'test' | 'analysis' | 'inspection' | 'demonstration';
    outcome: 'passed' | 'failed' | 'blocked';
    evidenceUrls?: Array<string>;
    verifiedBy: string;
    verifiedAt: string;
    notes?: string;
};

