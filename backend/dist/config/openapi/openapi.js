import { OpenAPIRegistry, OpenApiGeneratorV3, } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
export const registry = new OpenAPIRegistry();
/**
 * Shared response schemas
 */
export const ErrorResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
registry.register("ErrorResponse", ErrorResponseSchema);
/**
 * Generate OpenAPI document
 */
export function generateOpenApiDocument() {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: "3.0.3",
        info: {
            title: "AFTER API",
            version: "1.0.0",
            description: "AFTER — AI-powered financial decision companion.",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development",
            },
        ],
    });
}
//# sourceMappingURL=openapi.js.map