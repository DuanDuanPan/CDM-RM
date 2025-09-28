/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChangePackage = {
    id: string;
    title: string;
    ownerId: string;
    severity: 'high' | 'medium' | 'low';
    status: 'draft' | 'in_progress' | 'pending_verification' | 'completed' | 'closed';
    createdAt: string;
    dueAt?: string;
};

