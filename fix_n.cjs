const fs = require('fs');
let content = fs.readFileSync('src/services/aiService.ts', 'utf-8');
content = content.replace(/\\n/g, '\\n');
fs.writeFileSync('src/services/aiService.ts', content);
