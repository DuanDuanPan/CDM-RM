/* eslint-disable */
/* tslint:disable */
// 本文件由 scripts/generate-api-types.js 自动生成
export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 健康检查
         * @description 返回服务运行状态、OpenAPI JSON 与 Swagger UI 链接。
         */
        get: operations["App_getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Acknowledgement: {
            /** Format: date-time */
            ackAt: string;
            id: string;
            reason?: string;
            /** @enum {string} */
            status: "acknowledged" | "rejected";
            userId: string;
            workPackageId: string;
        };
        ApiError: {
            error: {
                code: string;
                details?: {
                    [key: string]: unknown;
                };
                message: string;
                requestId?: string;
                /** Format: date-time */
                timestamp?: string;
            };
        };
        ChangePackage: {
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            dueAt?: string;
            id: string;
            ownerId: string;
            /** @enum {string} */
            severity: "high" | "medium" | "low";
            /** @enum {string} */
            status: "draft" | "in_progress" | "pending_verification" | "completed" | "closed";
            title: string;
        };
        Closure: {
            changePackageId: string;
            /** Format: date-time */
            closedAt: string;
            id: string;
            /** @enum {string} */
            result: "passed" | "partially_passed" | "failed";
            summary: string;
        };
        Deliverable: {
            checksum?: string;
            id: string;
            metadata?: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            uploadedAt: string;
            url: string;
            workPackageId: string;
        };
        Diff: {
            after?: {
                [key: string]: unknown;
            };
            before?: {
                [key: string]: unknown;
            };
            changePackageId?: string;
            description?: string;
            /** Format: date-time */
            detectedAt: string;
            id: string;
            /** @enum {string} */
            severity: "high" | "medium" | "low";
            targetId: string;
            /** @enum {string} */
            targetType: "requirement" | "metric" | "rbom" | "other";
            /** @enum {string} */
            type: "added" | "modified" | "deleted";
        };
        Metric: {
            confidence?: number;
            extras?: {
                [key: string]: unknown;
            };
            id: string;
            /** @enum {string} */
            method: "rule" | "regex" | "dict" | "llm" | "manual";
            name: string;
            normalizedUnit?: string;
            range?: {
                lower?: number;
                lowerInc?: boolean;
                upper?: number;
                upperInc?: boolean;
            };
            requirementId: string;
            sourceFragment?: string;
            unit?: string;
            value?: number;
        };
        RbomNode: {
            baselineId?: string;
            code: string;
            extras?: {
                [key: string]: unknown;
            };
            id: string;
            level: number;
            name: string;
            parentId?: string;
            path: string;
        };
        Requirement: {
            content: string;
            /** Format: date-time */
            createdAt: string;
            dedupeHash: string;
            extras?: {
                [key: string]: unknown;
            };
            id: string;
            /** @enum {string} */
            priority: "P0" | "P1" | "P2" | "P3";
            source: {
                baselineId: string;
                moduleId: string;
                objectId: string;
            };
            /** @enum {string} */
            status: "draft" | "in_review" | "frozen" | "changing" | "closed";
            title: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            verificationMethod?: "test" | "analysis" | "inspection" | "demonstration";
        };
        RequirementRbomBinding: {
            baselineId?: string;
            /** Format: date-time */
            createdAt: string;
            id: string;
            rbomNodeId: string;
            requirementId: string;
        };
        Verification: {
            evidenceUrls?: string[];
            id: string;
            /** @enum {string} */
            method: "test" | "analysis" | "inspection" | "demonstration";
            metricId?: string;
            notes?: string;
            /** @enum {string} */
            outcome: "passed" | "failed" | "blocked";
            requirementId?: string;
            /** Format: date-time */
            verifiedAt: string;
            verifiedBy: string;
        };
        WorkPackage: {
            /** Format: date-time */
            ackAt?: string;
            assigneeId: string;
            changePackageId: string;
            id: string;
            /** Format: date-time */
            issuedAt: string;
            items?: {
                kind: string;
                refId: string;
            }[];
            /** @enum {string} */
            status: "issued" | "in_progress" | "done" | "closed";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    App_getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
export * from './custom-exports';

