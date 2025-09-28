/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Metric = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        requirementId: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        value: {
            type: 'number',
        },
        unit: {
            type: 'string',
        },
        normalizedUnit: {
            type: 'string',
        },
        range: {
            properties: {
                lower: {
                    type: 'number',
                },
                lowerInc: {
                    type: 'boolean',
                },
                upper: {
                    type: 'number',
                },
                upperInc: {
                    type: 'boolean',
                },
            },
        },
        method: {
            type: 'Enum',
            isRequired: true,
        },
        confidence: {
            type: 'number',
            maximum: 1,
        },
        sourceFragment: {
            type: 'string',
        },
        extras: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
    },
} as const;
