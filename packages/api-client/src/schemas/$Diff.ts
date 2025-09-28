/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Diff = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        type: {
            type: 'Enum',
            isRequired: true,
        },
        severity: {
            type: 'Enum',
            isRequired: true,
        },
        targetType: {
            type: 'Enum',
            isRequired: true,
        },
        targetId: {
            type: 'string',
            isRequired: true,
        },
        before: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        after: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        description: {
            type: 'string',
        },
        detectedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        changePackageId: {
            type: 'string',
        },
    },
} as const;
