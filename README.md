# Hao Xue — terminal portfolio

个人名片站（`#home` `#about` `#projects` `#contact`），视觉为 geek Matrix / CLI v3。博客只留了 MDX 目录，正文放到二期。

线上地址：[https://darkframemaster.github.io/](https://darkframemaster.github.io/)（仓库 `darkframemaster.github.com` 会跳到这里）。

## 本地

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

开发服务器默认在 <http://localhost:4321>。

生产构建与预览：

```bash
npm run build
npm run preview
```

`npm run build` 会：

1. 用 Astro 把静态站输出到 `dist/`
2. 把 GitHub Pages 要托管的文件同步到**仓库根目录**（`index.html`、`_astro/`、`blog/`、`404.html`、`favicon.svg`、`.nojekyll`）
3. 跑一遍文案和动效约束检查

`npm run check` 做 TypeScript / Astro 检查。

## GitHub Pages

这是用户站，发布源目前是 **`master` 分支的根目录**（legacy）。Pages 直接托管根目录上的构建结果，而不是 `src/`。

请提交 `npm run build` 之后更新过的根目录文件。根目录的 `.nojekyll` 用来跳过 Jekyll，否则 `_astro` 资源不会被发布。`dist/` 只是构建暂存，不进 Git。

用户站挂在域名根路径，Astro `site` 为 `https://darkframemaster.github.io`，`base` 为 `/`。

## 博客

把带 frontmatter 的 `.md` 或 `.mdx` 放到 `src/content/blog/` 后重新构建即可。MVP 不要求文章；`/blog/` 在没有文章时只说明目录留到二期。

```md
---
title: 笔记标题
description: 一两句摘要
pubDate: 2026-10-27
---
```

## 栈

Astro 5、TypeScript、Tailwind CSS、MDX。动效优先 CSS。JS 只负责打字机、顶栏时钟，以及最多 18 列、透明度约 0.40 的雨幕。`prefers-reduced-motion: reduce` 会关掉雨幕和扫描线漂移、提示符呼吸、光标闪烁，打字机直接显示全文。
