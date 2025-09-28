/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $WorkPackage = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        changePackageId: {
            type: 'string',
            isRequired: true,
        },
        assigneeId: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        issuedAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        ackAt: {
            type: 'string',
            format: 'date-time',
        },
        items: {
            type: 'array',
            contains: {
                properties: {
                    kind: {
                        type: 'string',
                        isRequired: true,
                    },
                    refId: {
                        type: 'string',
                        isRequired: true,
                    },
                },
            },
        },
    },
} as const;
