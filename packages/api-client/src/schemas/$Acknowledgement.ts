/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Acknowledgement = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        workPackageId: {
            type: 'string',
            isRequired: true,
        },
        userId: {
            type: 'string',
            isRequired: true,
        },
        ackAt: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        status: {
            type: 'Enum',
            isRequired: true,
        },
        reason: {
            type: 'string',
        },
    },
} as const;
