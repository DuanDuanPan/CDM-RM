/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Verification = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        requirementId: {
            type: 'string',
        },
        metricId: {
            type: 'string',
        },
        method: {
            type: 'Enum',
            isRequired: true,
        },
        outcome: {
            type: 'Enum',
            isRequired: true,
        },
        evidenceUrls: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        verifiedBy: {
            type: 'string',
            isRequired: true,
        },
        verifiedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        notes: {
            type: 'string',
        },
    },
} as const;
