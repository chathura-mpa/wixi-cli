import path from "path";
import { getOpenApiData, validateOpenApi } from "../utils/serviceUtils";
import { generateTypes } from "./service-gen/typeGenerator";
import { generateServices } from "./service-gen/serviceGenerator";

/**
 * Generates TypeScript types and services from an OpenAPI JSON spec.
 *
 * @param source - URL or local path to the OpenAPI JSON file
 * @param clientPath - Path to ApiClient import (default: ../api-client)
 * @param outputDir - Output directory (default: src/dashboard/services)
 * @param baseUrl - Base URL for the API (optional)
 */
export async function generateServicesFromOpenApi(
    source: string,
    clientPath: string = "../api-client",
    outputDir: string = path.resolve(process.cwd(), "src/dashboard/services"),
    baseUrl: string = ""
): Promise<void> {
    console.log("⚙️  Starting OpenAPI service generation...\n");

    try {
        const openapiData = await getOpenApiData(source);

        if (!validateOpenApi(openapiData)) {
            console.error("❌ Invalid OpenAPI structure. Aborting.")
            process.exit(1);
        }

        await generateTypes(openapiData, outputDir);
        await generateServices(openapiData, outputDir, clientPath);

        console.log(`\n✅ Services successfully generated in: ${outputDir}`);
    } catch (error: any) {
        console.error("\n❌ Failed to generate services:", error.message || error)
        process.exit(1);
    }
}