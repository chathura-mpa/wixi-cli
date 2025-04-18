const fs = require('fs-extra');
const path = require('path');

const source = path.resolve(__dirname, '../template');
const target = path.resolve(__dirname, '../dist/template');

fs.copy(source, target)
    .then(() => console.log('✅ Copied template to dist/template'))
    .catch(err => console.error('❌ Failed to copy template:', err));