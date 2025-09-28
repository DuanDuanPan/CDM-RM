/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Diff = {
    id: string;
    type: 'added' | 'modified' | 'deleted';
    severity: 'high' | 'medium' | 'low';
    targetType: 'requirement' | 'metric' | 'rbom' | 'other';
    targetId: string;
    before?: Record<string, any>;
    after?: Record<string, any>;
    description?: string;
    detectedAt: string;
    changePackageId?: string;
};

