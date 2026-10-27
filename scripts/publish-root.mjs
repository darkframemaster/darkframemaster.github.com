import { access, cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const manifestPath = path.join(root, ".pages-published.json");

const protectedNames = new Set([
  ".git",
  ".github",
  ".astro",
  ".gitignore",
  ".pages-published.json",
  "dist",
  "node_modules",
  "public",
  "scripts",
  "src",
  "README.md",
  "astro.config.mjs",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
]);

function inside(parent, name) {
  const resolved = path.resolve(parent, name);
  if (resolved !== parent && !resolved.startsWith(parent + path.sep)) {
    throw new Error(`refusing to touch path outside ${parent}: ${name}`);
  }
  return resolved;
}

await access(path.join(dist, "index.html"));

let previous = [];
try {
  previous = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!Array.isArray(previous)) previous = [];
} catch {
  previous = [];
}

for (const name of previous) {
  if (typeof name !== "string" || protectedNames.has(name)) continue;
  await rm(inside(root, name), { recursive: true, force: true });
}

const entries = await readdir(dist);
for (const name of entries) {
  if (protectedNames.has(name)) {
    throw new Error(`dist entry would overwrite source: ${name}`);
  }
  await cp(inside(dist, name), inside(root, name), { recursive: true });
}

await writeFile(manifestPath, `${JSON.stringify(entries, null, 2)}\n`);
