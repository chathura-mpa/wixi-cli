#!/usr/bin/env node
import { Command } from 'commander';
import path from "path";
import { bindTemplate } from './commands/bindTemplate';
import { installDependencies } from './commands/installDeps';
import { generateServicesFromOpenApi } from './commands/generateServices';

const program = new Command();

program
  .name('wixi')
  .description('A CLI for scaffolding and syncing dashboard projects')
  .version('1.0.0');

program
  .command('bind')
  .description('Bind project assets from the template')
  .action(() => {
    bindTemplate();
  });

program
  .command('deps')
  .description('Merge required dependencies into current package.json')
  .action(() => {
    installDependencies();
  });

program
  .command("gen")
  .description("Alias for generation-related commands")
  .command("services")
  .description("Generate TypeScript services from OpenAPI JSON")
  .argument("<source>", "URL or local path to OpenAPI JSON")
  .action(async (source: string) => {
    try {
      const { baseUrl } = program.opts();

      const outputDir = path.resolve(process.cwd(), "src/dashboard/services");

      // 🧠 Calculate relative path from outputDir to the api-client location
      const clientFullPath = path.resolve(process.cwd(), "src/dashboard/utils/api-client");
      const clientPath = path.relative(outputDir, clientFullPath).replace(/\\/g, "/");

      // Remove trailing .ts if present
      const importPath = clientPath.replace(/\.ts$/, "");

      await generateServicesFromOpenApi(source, importPath, outputDir, baseUrl);
    } catch (error: any) {
      console.error("❌ Failed to generate services.", error.message || error);
    }
  });

program.parse(process.argv);
