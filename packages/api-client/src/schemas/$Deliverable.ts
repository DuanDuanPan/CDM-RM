/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Deliverable = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        workPackageId: {
            type: 'string',
            isRequired: true,
        },
        url: {
            type: 'string',
            isRequired: true,
        },
        metadata: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        uploadedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        checksum: {
            type: 'string',
        },
    },
} as const;
