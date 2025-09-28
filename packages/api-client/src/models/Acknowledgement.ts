/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Acknowledgement = {
    id: string;
    workPackageId: string;
    userId: string;
    ackAt: string;
    status: 'acknowledged' | 'rejected';
    reason?: string;
};

