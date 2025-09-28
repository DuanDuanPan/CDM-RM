/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Requirement = {
    id: string;
    source: {
        moduleId: string;
        objectId: string;
        baselineId: string;
    };
    title: string;
    content: string;
    status: 'draft' | 'in_review' | 'frozen' | 'changing' | 'closed';
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    verificationMethod?: 'test' | 'analysis' | 'inspection' | 'demonstration';
    dedupeHash: string;
    extras?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
};

