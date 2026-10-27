export const identity = {
  name: 'Hao Xue (xuehao)',
  role: 'beijing · engineer',
  roleSpoken: 'Beijing · engineer',
  bio: '北京工程师 Hao Xue（xuehao）——关注机器学习、工程落地与个人作品沉淀。',
  github: 'https://github.com/darkframemaster',
  githubHandle: '@darkframemaster',
  email: 'darkframexue@gmail.com',
  contact:
    '欢迎通过 GitHub 或邮件联系，聊聊机器学习与工程落地。',
} as const;

export const nav = [
  { href: '#home', label: './home', mobile: '首页' },
  { href: '#about', label: './about', mobile: '关于' },
  { href: '#projects', label: './projects', mobile: '项目' },
  { href: '#contact', label: './contact', mobile: '联系' },
] as const;

export function sectionHref(pathname: string, hash: string): string {
  const onHome = pathname === '/' || pathname === '';
  return onHome ? hash : `/${hash}`;
}

export const aboutFacts = [
  { cmd: 'echo $FOCUS', value: '机器学习 · 工程落地 · 作品沉淀' },
  { cmd: 'echo $LOC', value: '北京' },
] as const;

export const featured = [
  {
    perm: 'drwxr-xr-x  featured  ─',
    name: 'ml-math-notes',
    href: 'https://github.com/darkframemaster/ml-math-notes',
    badges: ['featured'],
    description:
      '机器学习与数学的学习记录与分享——当前主推的能力沉淀入口。',
    tags: ['jupyter', 'ml', 'math'],
  },
  {
    perm: 'drwxr-xr-x  featured  fork ─',
    name: 'filebeat-output-clickhouse',
    href: 'https://github.com/darkframemaster/filebeat-output-clickhouse',
    badges: ['featured', 'fork'],
    description:
      'Filebeat 的 ClickHouse 输出插件二次开发 / 工程实践，偏日志链路落地。',
    tags: ['go', 'filebeat', 'clickhouse'],
  },
] as const;

export const early = [
  {
    perm: '-rw-r--r--',
    meta: 'early·fork',
    name: 'ChineseStopWords',
    href: 'https://github.com/darkframemaster/ChineseStopWords',
    description: '常用中文停用词表。',
  },
  {
    perm: '-rw-r--r--',
    meta: 'early·fork',
    name: 'bilibili-video',
    href: 'https://github.com/darkframemaster/bilibili-video',
    description: 'Bilibili 视频爬虫。',
  },
  {
    perm: '-rw-r--r--',
    meta: 'early',
    name: 'pyblog',
    href: 'https://github.com/darkframemaster/pyblog',
    description: '自研 Python 博客框架。',
  },
] as const;

export const heroCommands = [
  { href: '#projects', label: '$ cd ./projects && ls', tone: 'primary' },
  { href: '#contact', label: '$ cd ./contact', tone: 'soft' },
  { href: '#about', label: '$ less ./about', tone: 'dim' },
] as const;
