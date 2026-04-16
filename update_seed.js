import fs from 'fs';
const content = fs.readFileSync('src/data/seed.ts', 'utf-8');
const updated = content.replace(/note: '([^']+)'/g, "note: '$1', implementationStatus: 'mock_only'");
fs.writeFileSync('src/data/seed.ts', updated);
