/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RbomNode = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        code: {
            type: 'string',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        level: {
            type: 'number',
            isRequired: true,
        },
        parentId: {
            type: 'string',
        },
        path: {
            type: 'string',
            isRequired: true,
        },
        baselineId: {
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
