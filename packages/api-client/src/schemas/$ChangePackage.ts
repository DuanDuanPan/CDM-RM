/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ChangePackage = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        title: {
            type: 'string',
            isRequired: true,
        },
        ownerId: {
            type: 'string',
            isRequired: true,
        },
        severity: {
            type: 'Enum',
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        dueAt: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
