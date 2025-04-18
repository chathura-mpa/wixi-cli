import path from 'path';
import fs from 'fs-extra';
import { copyFilteredTemplate } from '../utils/fileUtils';

export async function bindTemplate() {
  const templatePath = path.resolve(__dirname, '../../../template/src');
  const destinationPath = path.resolve(process.cwd(), 'src');

  console.log('⚙️  Binding template to current project...');

  try {
    await copyFilteredTemplate(templatePath, destinationPath);
    console.log('✅ Template successfully bound!');
  } catch (error) {
    console.error('❌ Failed to bind template:', error);
  }
}
