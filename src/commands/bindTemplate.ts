import path from 'path';
import fs from 'fs-extra';
import readline from 'readline';
import { copyFilteredTemplate } from '../utils/fileUtils';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

async function backupSrcAsZip(srcPath: string): Promise<string | null> {
  if (!(await fs.pathExists(srcPath))) return null;

  const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
  const zipName = `src-backup-${timestamp}.zip`;
  const outputPath = path.resolve(process.cwd(), zipName);

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`📦 Backup created: ${zipName} (${archive.pointer()} bytes)`);
      resolve(zipName);
    });

    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(srcPath, 'src');
    archive.finalize();
  });
}

async function promptUser(message: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(message, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function bindTemplate(): Promise<void> {
  const templatePath = path.resolve(__dirname, '../../template/src');
  const projectRoot = process.cwd();
  const destinationPath = path.join(projectRoot, 'src');

  console.log('⚙️  Preparing to bind template...\n');

  try {
    const srcExists = await fs.pathExists(destinationPath);

    if (srcExists) {
      const backupZip = await backupSrcAsZip(destinationPath);
      if (backupZip) {
        console.log(`📦 Existing src/ backed up as ${backupZip}`);
      }

      const userChoice = await promptUser(
        `⚠️ src/ already exists. What would you like to do?\n` +
        `1) Delete src and bind template (clean overwrite)\n` +
        `2) Merge template into existing src (may overwrite files)\n` +
        `3) Cancel\n\n` +
        `Choose [1/2/3]: `
      );

      if (userChoice === '1') {
        await fs.remove(destinationPath);
        await fs.ensureDir(destinationPath);
        await copyFilteredTemplate(templatePath, destinationPath);
        console.log('✅ Template bound after clean overwrite.');
      } else if (userChoice === '2') {
        await copyFilteredTemplate(templatePath, destinationPath);
        console.log('✅ Template merged into existing src.');
      } else {
        console.log('❌ Operation cancelled by user.');
        return;
      }
    } else {
      await copyFilteredTemplate(templatePath, destinationPath);
      console.log('✅ Template successfully bound.');
    }
  } catch (error) {
    console.error('❌ Failed to bind template:', error);
  }
}