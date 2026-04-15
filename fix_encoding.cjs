const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');

const mapping = {
  'â€”': '—',
  'â”€': '─',
  'âš\xa0ï¸': '⚠️',
  'â†’': '→',
  'â€™': "'",
  'â€œ': '"',
  'â€\x9d': '"'
};

function processDir(d) {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const fullPath = path.join(d, f);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [key, val] of Object.entries(mapping)) {
        if (content.includes(key)) {
          content = content.split(key).join(val);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir(dir);
console.log('Done.');
