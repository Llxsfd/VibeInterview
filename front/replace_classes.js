const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /className="content"/g, repl: 'className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500"' },
  { regex: /className="grid-4"/g, repl: 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"' },
  { regex: /className="grid-3"/g, repl: 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"' },
  { regex: /className="grid-2"/g, repl: 'className="grid grid-cols-1 lg:grid-cols-2 gap-6"' },
  { regex: /className="grid-2 mt-4"/g, repl: 'className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"' },
  { regex: /className="stack"/g, repl: 'className="space-y-6"' },
  { regex: /className="panel-pad"/g, repl: 'className="p-6"' },
  { regex: /className="panel-pad stack"/g, repl: 'className="p-6 space-y-6"' },
  { regex: /className="data-row"/g, repl: 'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"' },
  { regex: /className="row-title"/g, repl: 'className="font-semibold leading-none"' },
  { regex: /className="muted"/g, repl: 'className="text-sm text-muted-foreground"' },
  { regex: /className="form-grid"/g, repl: 'className="flex flex-col gap-5 max-w-xl"' },
];

walkDir('d:\\Project\\智能面试系统\\front\\src\\app', (filePath) => {
  if (filePath.endsWith('.tsx') && !filePath.includes('dashboard') && !filePath.includes('auth')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const r of replacements) {
      content = content.replace(r.regex, r.repl);
    }
    
    // Auto-wrap children of AppShell with a container if it's just <AppShell> ... </AppShell>
    // Actually the "content" replacement should handle most of it if it was wrapped in <main className="content">
    // Some pages might not have it. Let's just do standard replacements for now.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
