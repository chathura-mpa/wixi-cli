import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface RequiredDeps {
    fixedDependencies?: Record<string, string>;
    dependencies?: string[];
    fixedDevDependencies?: Record<string, string>;
    devDependencies?: string[];
}

export function installDependencies(): void {
    const depsPath = path.resolve(__dirname, '../../template/required_dependancies.json');
    const userPackagePath = path.resolve(process.cwd(), 'package.json');

    if (!fs.existsSync(depsPath)) {
        console.error('❌ required_dependancies.json not found in CLI template.');
        process.exit(1);
    }

    if (!fs.existsSync(userPackagePath)) {
        console.error('❌ No package.json found in current directory.');
        process.exit(1);
    }

    const requiredDeps: RequiredDeps = JSON.parse(fs.readFileSync(depsPath, 'utf-8'));
    const userPackageJson = JSON.parse(fs.readFileSync(userPackagePath, 'utf-8'));

    const userDeps = userPackageJson.dependencies || {};
    const userDevDeps = userPackageJson.devDependencies || {};

    const toInstall: string[] = [];
    const toInstallDev: string[] = [];

    const log = (pkg: string, isDev: boolean) =>
        console.log(`📦 Queued: ${pkg} ${isDev ? '(dev)' : ''}`);

    // Fixed dependencies
    for (const [pkg, version] of Object.entries(requiredDeps.fixedDependencies || {})) {
        if (!userDeps[pkg] && !userDevDeps[pkg]) {
            toInstall.push(`${pkg}@${version}`);
            log(`${pkg}@${version}`, false);
        }
    }

    // Wildcard dependencies
    for (const pkg of requiredDeps.dependencies || []) {
        if (!userDeps[pkg] && !userDevDeps[pkg]) {
            toInstall.push(pkg);
            log(pkg, false);
        }
    }

    // Fixed devDependencies
    for (const [pkg, version] of Object.entries(requiredDeps.fixedDevDependencies || {})) {
        if (!userDeps[pkg] && !userDevDeps[pkg]) {
            toInstallDev.push(`${pkg}@${version}`);
            log(`${pkg}@${version}`, true);
        }
    }

    // Wildcard devDependencies
    for (const pkg of requiredDeps.devDependencies || []) {
        if (!userDeps[pkg] && !userDevDeps[pkg]) {
            toInstallDev.push(pkg);
            log(pkg, true);
        }
    }

    // Run batch yarn commands
    if (toInstall.length > 0) {
        const cmd = `yarn add ${toInstall.join(' ')} --silent`;
        console.log(`\n🚀 Installing dependencies: ${toInstall.length} packages`);
        execSync(cmd, { stdio: 'inherit' });
    } else {
        console.log('\n✅ No new dependencies to install.');
    }

    if (toInstallDev.length > 0) {
        const cmd = `yarn add ${toInstallDev.join(' ')} --dev --silent`;
        console.log(`\n🚀 Installing devDependencies: ${toInstallDev.length} packages`);
        execSync(cmd, { stdio: 'inherit' });
    } else {
        console.log('\n✅ No new devDependencies to install.');
    }

    console.log('\n✅ All required dependencies are up to date.');
}