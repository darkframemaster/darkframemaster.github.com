import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const home = read("dist/index.html");
const published = read("index.html");
if (home !== published) fail("repo-root index.html is not the dist build");

const visible = home
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "");

const required = [
  "Hao Xue (xuehao)",
  "beijing · engineer",
  "北京工程师 Hao Xue（xuehao）——关注机器学习、工程落地与个人作品沉淀。",
  "欢迎通过 GitHub 或邮件联系，聊聊机器学习与工程落地。",
  "mailto:darkframexue@gmail.com",
  "https://github.com/darkframemaster",
  "ml-math-notes",
  "filebeat-output-clickhouse",
  "ChineseStopWords",
  "bilibili-video",
  "pyblog",
  'id="tw-name"',
  'id="tw-bio"',
  'id="rain"',
  'data-max-columns="18"',
  "精选近期作品；早期与 fork 项目以更轻的样式排布。",
  "常用中文停用词表。",
  "Bilibili 视频爬虫。",
  "自研 Python 博客框架。",
];

for (const text of required) {
  if (!visible.includes(text)) fail(`homepage HTML is missing: ${text}`);
}

const banned = [
  "linkedin",
  "darkframexue.com",
  "outlook.com",
  "[ESC]",
  "[/] find",
  "弱展示",
  "较弱",
  "陈旧",
  "过时",
  "不再维护",
];

const distFiles = walk(path.join(root, "dist")).filter((file) =>
  /\.(html|css|js|mjs|svg|json)$/.test(file),
);
const distText = distFiles.map((file) => readFileSync(file, "utf8")).join("\n");
for (const text of banned) {
  if (distText.toLowerCase().includes(text.toLowerCase())) {
    fail(`built site contains banned copy: ${text}`);
  }
}

const css = read("src/styles/global.css");
const script = read("src/scripts/terminal.ts");
for (const text of [
  "prefers-reduced-motion: reduce",
  "animation: none",
  "opacity: 0.22",
  "#rain",
]) {
  if (!css.includes(text)) fail(`global.css missing ${text}`);
}
if (!css.includes(".scanlines::before") || !css.includes(".prompt-live") || !css.includes(".blink::after")) {
  fail("reduced-motion block must disable scanline drift, prompt breathe, and blink");
}
for (const text of [
  '"(prefers-reduced-motion: reduce)"',
  "MAX_COLUMNS = 18",
  "document.hidden",
  "tw-name",
]) {
  if (!script.includes(text)) fail(`terminal.ts missing ${text}`);
}

const builtCss = distFiles.filter((file) => file.endsWith(".css")).map((file) => readFileSync(file, "utf8")).join("\n");
if (!builtCss.includes("prefers-reduced-motion")) fail("built CSS dropped the reduced-motion query");
if (!/opacity:\s*0?\.22/.test(builtCss)) fail("built CSS is missing rain opacity 0.22");

const clientCode = distFiles
  .filter((file) => file.endsWith(".js") || file.endsWith(".html"))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
if (!clientCode.includes("prefers-reduced-motion")) fail("built pages do not check reduced motion");
if (!clientCode.includes("Math.min(18")) fail("rain column cap is missing from the client script");

const blog = read("dist/blog/index.html");
if (!blog.includes("长文还没放进来")) fail("blog shell is missing its empty state");
try {
  statSync(path.join(root, ".nojekyll"));
  statSync(path.join(root, "dist", ".nojekyll"));
} catch {
  fail(".nojekyll must ship with the Pages build");
}

const assetRefs = [...home.matchAll(/\/_astro\/[^"')\s]+/g)].map((match) => match[0]);
if (assetRefs.length === 0) fail("homepage does not reference built assets");
for (const ref of assetRefs) {
  try {
    statSync(path.join(root, "dist", ref));
  } catch {
    fail(`missing asset ${ref}`);
  }
}

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("pages build verified");
