/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Metric = {
    id: string;
    requirementId: string;
    name: string;
    value?: number;
    unit?: string;
    normalizedUnit?: string;
    range?: {
        lower?: number;
        lowerInc?: boolean;
        upper?: number;
        upperInc?: boolean;
    };
    method: 'rule' | 'regex' | 'dict' | 'llm' | 'manual';
    confidence?: number;
    sourceFragment?: string;
    extras?: Record<string, any>;
};

