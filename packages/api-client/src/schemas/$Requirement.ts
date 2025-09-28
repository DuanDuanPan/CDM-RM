/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Requirement = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        source: {
            properties: {
                moduleId: {
                    type: 'string',
                    isRequired: true,
                },
                objectId: {
                    type: 'string',
                    isRequired: true,
                },
                baselineId: {
                    type: 'string',
                    isRequired: true,
                },
            },
            isRequired: true,
        },
        title: {
            type: 'string',
            isRequired: true,
        },
        content: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        priority: {
            type: 'Enum',
            isRequired: true,
        },
        verificationMethod: {
            type: 'Enum',
        },
        dedupeHash: {
            type: 'string',
            isRequired: true,
        },
        extras: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updatedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
