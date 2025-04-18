import axios from "axios";
import fs from "fs";

/**
 * Fetches or loads OpenAPI JSON from a URL or local file path.
 *
 * @param source - URL or file path to the OpenAPI JSON
 * @returns Parsed OpenAPI object
 */
export async function getOpenApiData(source: string): Promise<any> {
    try {
        const isUrl = /^https?:\/\//.test(source);

        if (isUrl) {
            console.log(`🌐 Fetching OpenAPI JSON from: ${source}`)
            const response = await axios.get(source, { timeout: 10000 });
            return response.data;
        } else {
            console.log(`📄 Reading local OpenAPI file: ${source}`)
            const fileContent = fs.readFileSync(source, "utf-8");
            return JSON.parse(fileContent);
        }
    } catch (error: any) {
        console.error("❌ Failed to fetch or read OpenAPI JSON")
        throw new Error(error.message || "Unknown error");
    }
}

/**
 * Validates that the OpenAPI structure contains required elements.
 *
 * @param data - The OpenAPI object
 * @returns true if valid, false otherwise
 */
export function validateOpenApi(data: any): boolean {
    if (!data || typeof data !== "object") {
        console.error("❌ OpenAPI data is not a valid object.")
        return false;
    }

    const hasPaths = data.paths && typeof data.paths === "object";
    const hasSchemas = data.components?.schemas || data.definitions;

    if (!hasPaths && !hasSchemas) {
        console.error("❌ OpenAPI JSON missing 'paths' or 'components.schemas'.")
        return false;
    }

    return true;
}