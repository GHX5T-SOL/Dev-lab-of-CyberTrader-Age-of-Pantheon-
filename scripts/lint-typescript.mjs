import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const TARGET_DIRS = ["src", "backend"];
const SKIP_DIRS = new Set([
  ".expo",
  ".git",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const BLOCKED_PATTERNS = [
  {
    name: "debugger statement",
    regex: /\bdebugger\b/g,
  },
  {
    name: "console.log",
    regex: /\bconsole\.log\s*\(/g,
  },
];

const files = [];

function collectTypeScriptFiles(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        collectTypeScriptFiles(path.join(dir, entry.name));
      }
      continue;
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
}

function lineAndColumnFor(source, index) {
  const { line, character } = source.getLineAndCharacterOfPosition(index);
  return `${line + 1}:${character + 1}`;
}

for (const targetDir of TARGET_DIRS) {
  collectTypeScriptFiles(path.join(ROOT, targetDir));
}

files.sort();

const issues = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind);
  const relativeFile = path.relative(ROOT, file);

  for (const diagnostic of source.parseDiagnostics) {
    const location =
      typeof diagnostic.start === "number"
        ? lineAndColumnFor(source, diagnostic.start)
        : "1:1";
    issues.push(
      `${relativeFile}:${location} parse error TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        " ",
      )}`,
    );
  }

  for (const pattern of BLOCKED_PATTERNS) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      issues.push(
        `${relativeFile}:${lineAndColumnFor(source, match.index ?? 0)} blocked ${
          pattern.name
        }`,
      );
    }
  }
}

if (issues.length > 0) {
  console.error(`TypeScript lint found ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(
  `TypeScript lint checked ${files.length} file(s); no parse errors or blocked debug statements.`,
);
