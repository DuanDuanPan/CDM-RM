/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkPackage = {
    id: string;
    changePackageId: string;
    assigneeId: string;
    status: 'issued' | 'in_progress' | 'done' | 'closed';
    issuedAt: string;
    ackAt?: string;
    items?: Array<{
        kind: string;
        refId: string;
    }>;
};

