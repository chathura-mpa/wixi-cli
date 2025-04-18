import fs from "fs";
import path from "path";
import {
    OpenAPIObject,
    OperationObject,
    ParameterObject,
    PathItemObject,
    ReferenceObject,
    RequestBodyObject,
    SchemaObject,
} from "openapi3-ts/dist/oas30";

export type OpenApiSchema = SchemaObject | ReferenceObject;

export interface OpenApiMethodDetails {
    summary?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses?: {
        [statusCode: string]: {
            description?: string;
            content?: {
                [contentType: string]: {
                    schema?: SchemaObject | ReferenceObject;
                };
            };
        };
    };
}

function isRef(obj: any): obj is ReferenceObject {
    return !!obj.$ref;
}

function resolveRef(ref: string): string {
    return ref.split("/").pop() || "unknown";
}

function filterNonRefSchemas(schemas: Record<string, SchemaObject | ReferenceObject>): Record<string, SchemaObject> {
    return Object.fromEntries(
        Object.entries(schemas).filter(([_, val]) => !("$ref" in val))
    ) as Record<string, SchemaObject>;
}

export function schemaToTsType(
    schema?: SchemaObject | ReferenceObject,
    schemas: Record<string, SchemaObject> = {}
): string {
    if (!schema) return "unknown";
    if (isRef(schema)) return resolveRef(schema.$ref);

    if (schema.oneOf) return schema.oneOf.map((s: any) => schemaToTsType(s, schemas)).join(" | ");
    if (schema.allOf) return schema.allOf.map((s: any) => schemaToTsType(s, schemas)).join(" & ");
    if (schema.anyOf) return schema.anyOf.map((s: any) => schemaToTsType(s, schemas)).join(" | ");
    if (schema.type === "array") return `${schemaToTsType(schema.items, schemas)}[]`;

    if (schema.type === "object") return generateInlineInterface(schema, schemas);
    if (schema.type === "string") return "string";
    if (schema.type === "number" || schema.type === "integer") return "number";
    if (schema.type === "boolean") return "boolean";

    return "unknown";
}

function generateInlineInterface(schema: SchemaObject, schemas: Record<string, SchemaObject>): string {
    if (!schema.properties) return "{}";

    let str = "{ ";
    for (const [key, val] of Object.entries(schema.properties)) {
        const required = schema.required?.includes(key);
        const type = schemaToTsType(val, schemas);
        str += `${key}${required ? "" : "?"}: ${type}; `;
    }
    str += "}";
    return str;
}

export function schemaToInterface(
    name: string,
    schema: SchemaObject | ReferenceObject,
    schemas: Record<string, SchemaObject> = {},
    indent = "  "
): string {
    if (isRef(schema)) {
        name = resolveRef(schema.$ref);
        const resolvedSchema = schemas[name];
        schema = isRef(resolvedSchema) ? {} : resolvedSchema || {};
    }

    let str = `/** ${schema.description || `Interface for ${name}`} */\n`;
    str += `export interface ${name}`;

    if ("allOf" in schema && schema.allOf) {
        const bases = schema.allOf.map((s: any) => schemaToTsType(s, schemas)).filter((b: string) => b !== "unknown");
        if (bases.length) str += ` extends ${bases.join(", ")}`;
    }

    str += ` {\n`;

    if (schema.properties) {
        for (const [key, val] of Object.entries(schema.properties)) {
            const required = schema.required?.includes(key);
            const type = schemaToTsType(val, schemas);
            str += `${indent}/** ${(val as SchemaObject).description || key} */\n`;
            str += `${indent}${key}${required ? "" : "?"}: ${type};\n`;
        }
    }

    str += `}\n`;
    return str;
}

export async function generateTypes(openapiData: OpenAPIObject, outputDir: string): Promise<void> {
    const typesDir = path.resolve(process.cwd(), "src/interfaces/api-types");

    if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
        console.log(`Created directory: ${typesDir}`);
    }

    const schemas = openapiData.components?.schemas ?? {};
    const filteredSchemas = filterNonRefSchemas(schemas);

    await Promise.all(
        Object.entries(filteredSchemas).map(async ([name, schema]) => {
            const code = schemaToInterface(name, schema, filteredSchemas);
            const filePath = path.join(typesDir, `${name}.ts`);
            fs.writeFileSync(filePath, code);
            console.log(`Generated interface: ${filePath}`);
        })
    );

    const paths = openapiData.paths ?? {};
    const endpointInterfaces: Record<string, string[]> = {};

    for (const [pathKey, pathItem] of Object.entries(paths)) {
        const pathName = pathKey.split("/").filter(Boolean).join("-") || "default";
        endpointInterfaces[pathName] = [];

        for (const [method, op] of Object.entries(pathItem as PathItemObject)) {
            if (!["get", "post", "put", "delete", "patch"].includes(method)) continue;

            const operation = op as OperationObject;
            const methodName = `${method.toUpperCase()}${pathName.charAt(0).toUpperCase() + pathName.slice(1)}`;

            // Params
            let paramCode = "";
            if (operation.parameters?.length) {
                paramCode += `/** Parameters for ${method.toUpperCase()} ${pathKey} */\n`;
                paramCode += `export interface ${methodName}Params {\n`;
                for (const param of operation.parameters as ParameterObject[]) {
                    const paramType = schemaToTsType(param.schema, filteredSchemas);
                    paramCode += `  /** ${param.description || param.name} */\n`;
                    paramCode += `  ${param.name}${param.required ? "" : "?"}: ${paramType};\n`;
                }
                paramCode += `}\n`;
            }

            // Request
            let reqCode = "";
            const reqSchema = (operation.requestBody as RequestBodyObject)?.content?.["application/json"]?.schema;
            if (reqSchema && !["get", "delete"].includes(method)) {
                const reqType = schemaToTsType(reqSchema, filteredSchemas);
                if (isRef(reqSchema) || reqType !== "unknown") {
                    reqCode = schemaToInterface(`${methodName}Request`, reqSchema, filteredSchemas);
                    reqCode += `export type ${methodName}Request = ${reqType};\n`;
                } else {
                    reqCode = schemaToInterface(`${methodName}Request`, reqSchema, filteredSchemas);
                }
            }

            // Response
            let resCode = "";
            const resSchema = operation.responses?.["200"]?.content?.["application/json"]?.schema;
            if (resSchema) {
                const resType = schemaToTsType(resSchema, filteredSchemas);
                if (isRef(resSchema) || resType !== "unknown") {
                    resCode = `/** Response for ${method.toUpperCase()} ${pathKey} */\n`;
                    resCode += `export type ${methodName}Response = ${resType};\n`;
                } else {
                    resCode = schemaToInterface(`${methodName}Response`, resSchema, filteredSchemas);
                }
            }

            endpointInterfaces[pathName].push([paramCode, reqCode, resCode].filter(Boolean).join("\n"));
        }

        const filePath = path.join(typesDir, `${pathName}.ts`);
        const content = endpointInterfaces[pathName].join("\n");
        if (content) {
            fs.writeFileSync(filePath, content);
            console.log(`Generated endpoint types: ${filePath}`);
        }
    }

    generateBarrelFile(typesDir);
}

function generateBarrelFile(dir: string): void {
    const files = fs.readdirSync(dir).filter(file => file.endsWith(".ts") && file !== "index.ts");

    const exports = files.map(file => {
        const name = path.basename(file, ".ts");
        return `export * from "./${name}";`;
    }).join("\n");

    const indexPath = path.join(dir, "index.ts");
    fs.writeFileSync(indexPath, exports + "\n");
    console.log(`✅ Generated barrel file: ${indexPath}`);
}