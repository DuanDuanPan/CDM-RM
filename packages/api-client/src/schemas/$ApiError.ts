/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiError = {
    properties: {
        error: {
            properties: {
                code: {
                    type: 'string',
                    isRequired: true,
                },
                message: {
                    type: 'string',
                    isRequired: true,
                },
                details: {
                    type: 'dictionary',
                    contains: {
                        properties: {
                        },
                    },
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                },
                requestId: {
                    type: 'string',
                },
            },
            isRequired: true,
        },
    },
} as const;
