import path from 'path';
import fs from 'fs-extra';

export async function copyFilteredTemplate(templatePath: string, destinationPath: string): Promise<void> {
  const entries = await fs.readdir(templatePath);

  for (const entry of entries) {
    const srcPath = path.join(templatePath, entry);
    const destPath = path.join(destinationPath, entry);

    if (
      entry === 'dashboard' &&
      (await fs.pathExists(path.join(srcPath, 'pages')))
    ) {
      const subEntries = await fs.readdir(srcPath);
      for (const sub of subEntries) {
        if (sub !== 'pages') {
          const subSrc = path.join(srcPath, sub);
          const subDest = path.join(destPath, sub);
          await fs.copy(subSrc, subDest);
        }
      }
    } else if (!(entry === 'dashboard')) {
      await fs.copy(srcPath, destPath);
    }
  }
}
