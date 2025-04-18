import { Command } from 'commander';
import { bindTemplate } from './commands/bindTemplate';

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

program.parse(process.argv);
