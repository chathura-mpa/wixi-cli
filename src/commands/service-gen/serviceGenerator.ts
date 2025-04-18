import fs from "fs";
import path from "path";
import { OpenApiMethodDetails, OpenApiSchema, generateTypes } from "./typeGenerator";
import { OpenAPIObject } from "openapi3-ts/dist/oas30";

// === Type Definitions ===
type ReferenceObject = { $ref: string };
type SchemaLike = OpenApiSchema | ReferenceObject;

interface OpenApiData {
    components?: {
        schemas?: Record<string, SchemaLike>;
    };
    paths?: Record<string, Record<string, OpenApiMethodDetails>>;
    definitions?: Record<string, SchemaLike>; // legacy support
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateApiEndpoints(paths: Record<string, any>): Record<string, string> {
    const lines: string[] = [];
    lines.push('import { APP_CONSTANTS } from "./app-constants";');
    lines.push("export const API_ENDPOINTS = {");

    const endpointMap: Record<string, string> = {};

    Object.keys(paths).forEach((originalPath, index, array) => {
        const key = originalPath
            .replace(/{(\w+)}/g, "_$1")
            .replace(/\/$/, "")
            .replace(/^\//, "")
            .replace(/\//g, "_")
            .replace(/-/g, "_")
            .toUpperCase() || "ROOT";

        const normalizedPath = originalPath === "/" ? "/" : originalPath;
        endpointMap[originalPath] = key;

        const isLast = index === array.length - 1;
        const line = `  ${key}: APP_CONSTANTS.baseUrl + "${normalizedPath}"${isLast ? "" : ","}`;
        lines.push(line);
    });

    lines.push("};\n");

    const outputPath = path.resolve(process.cwd(), "src/constants/api-endpoints.ts");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, lines.join("\n"));
    console.log(`✅ Generated API_ENDPOINTS: ${outputPath}`);

    return endpointMap;
}

export async function generateServices(
    openapiData: OpenAPIObject,
    outputDir: string,
    clientPath: string
): Promise<void> {
    const typesDir = path.resolve(process.cwd(), "src/interfaces/api-types");
    const constantsDir = path.resolve(process.cwd(), "src/constants");
    const servicesDir = path.resolve(outputDir);

    // Step 1: Generate API_ENDPOINTS constants
    const endpointKeyMap = generateApiEndpoints(openapiData.paths || {});

    // Step 2: Generate API types
    await generateTypes(openapiData, typesDir);

    // Step 3: Generate services
    if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

    await Promise.all(
        Object.entries(openapiData.paths || {}).map(async ([pathEndpoint, methods]) => {
            const endpointName = pathEndpoint.split("/").filter(Boolean).join("-") || "default";
            const serviceFile = path.join(servicesDir, `${endpointName}.ts`);

            const apiTypesDir = path.resolve(process.cwd(), "src/interfaces/api-types");
            const relativeImport = path.relative(servicesDir, path.join(apiTypesDir, endpointName)).replace(/\\/g, "/").replace(/\.ts$/, "");

            let serviceCode = `import ApiClient from "${clientPath}";\n`;
            serviceCode += `import { API_ENDPOINTS } from "../../constants/api-endpoints";\n`;
            serviceCode += `import { IApiResponse } from "../../interfaces";\n\n`;

            const imports: string[] = [];
            for (const [method, details] of Object.entries(methods)) {
                const capitalized = capitalize(endpointName);
                const methodName = `${method.toUpperCase()}${capitalized}`;

                if (details.parameters?.length) imports.push(`${methodName}Params`);
                if (details.requestBody && !["get", "delete"].includes(method.toLowerCase())) imports.push(`${methodName}Request`);
                if (details.responses?.["200"]) imports.push(`${methodName}Response`);
            }

            if (imports.length) {
                serviceCode += `import { ${imports.join(", ")} } from "${relativeImport}";\n\n`;
            }

            for (const [method, details] of Object.entries(methods)) {
                const methodLower = method.toLowerCase();
                const capitalized = capitalize(endpointName);
                const methodName = `${methodLower}${capitalized}`;
                const key = endpointKeyMap[pathEndpoint];

                const hasParams = !!details.parameters?.length;
                const hasBody = !!details.requestBody && ["post", "put", "patch"].includes(methodLower);

                const funcParams: string[] = [];
                if (hasParams) funcParams.push(`params: ${method.toUpperCase()}${capitalized}Params`);
                if (hasBody) funcParams.push(`body: ${method.toUpperCase()}${capitalized}Request`);

                const returnType = details.responses?.["200"] ? `${method.toUpperCase()}${capitalized}Response` : "unknown";

                serviceCode += `/** ${details.summary || `${method.toUpperCase()} ${pathEndpoint}`} */\n`;
                serviceCode += `export const ${methodName} = async (${funcParams.join(", ")}): Promise<IApiResponse<${returnType}>> => {\n`;
                serviceCode += `  const url = API_ENDPOINTS.${key};\n`;
                serviceCode += `  return await ApiClient.request(url, '${method.toUpperCase()}'${hasBody ? `, body` : `, null`}, true${hasParams ? `, { params }` : ``});\n`;
                serviceCode += `};\n\n`;
            }

            fs.writeFileSync(serviceFile, serviceCode);
            console.log(`\u2705 Generated service file: ${serviceFile}`);
        })
    );
}