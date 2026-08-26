import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
export declare const registry: OpenAPIRegistry;
/**
 * Shared response schemas
 */
export declare const ErrorResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>;
/**
 * Generate OpenAPI document
 */
export declare function generateOpenApiDocument(): import("openapi3-ts/oas30").OpenAPIObject;
