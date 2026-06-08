const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes('<AppShell>')) {
    // Remove import { AppShell } from "@/components/AppShell";
    content = content.replace(/import\s*{\s*AppShell\s*}\s*from\s*["']@\/components\/AppShell["'];?[\r\n]*/, '');
    
    // Replace <AppShell> with empty string or <>, and </AppShell>
    // But actually, we might just replace <AppShell> and </AppShell> with <> and </> to keep valid JSX
    content = content.replace(/<AppShell>/g, '<>');
    content = content.replace(/<\/AppShell>/g, '</>');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Updated ' + filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir(path.join(__dirname, 'src/app/(app)'));
