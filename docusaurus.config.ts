import fs from 'node:fs';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Released doc versions, newest first (written by `npm run release-docs`). Empty until the first release is cut,
// and then the docs in docs/ are the unreleased ones.
const versions: string[] = fs.existsSync('versions.json') ? JSON.parse(fs.readFileSync('versions.json', 'utf8')) : [];

// Cloudflare Web Analytics (no cookies), only in builds that set the site's token.
const analyticsToken = process.env.CF_WEB_ANALYTICS_TOKEN;

const config: Config = {
  title: 'Tawi',
  tagline: 'Fine-tune and serve your own AI agents on your own computer.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // tawi.ai serves the whole site; docs.tawi.ai redirects to tawi.ai/docs (functions/_middleware.js).
  url: 'https://tawi.ai',
  baseUrl: '/',
  trailingSlash: false,

  scripts: analyticsToken
    ? [
        {
          src: 'https://static.cloudflareinsights.com/beacon.min.js',
          defer: true,
          'data-cf-beacon': JSON.stringify({token: analyticsToken}),
        },
      ]
    : [],

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    // .md pages (the ones copied from the Tawi repo) are plain CommonMark, so `{` and `<` in them need no escaping
    format: 'detect',
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          docItemComponent: '@theme/ApiItem',
          lastVersion: versions[0] ?? 'current',
          versions: {
            current: versions.length
              ? {label: 'Next (unreleased)', path: 'next', banner: 'unreleased'}
              : {label: 'Next (unreleased)', banner: 'none'},
          },
        },
        blog: {
          blogTitle: 'Blog',
          blogDescription: 'Releases, benchmarks and how-tos from the people who make Tawi.',
          postsPerPage: 10,
          showReadingTime: true,
          onInlineTags: 'throw',
          onInlineAuthors: 'throw',
          onUntruncatedBlogPosts: 'throw',
          feedOptions: {type: ['rss', 'atom'], copyright: 'Tawi'},
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          agent: {
            specPath: 'static/openapi/agent.yaml',
            outputDir: 'docs/api/agent',
            sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'auto'},
            showSchemas: true,
          },
          studio: {
            specPath: 'static/openapi/studio.yaml',
            outputDir: 'docs/api/studio',
            sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'auto'},
            showSchemas: true,
          },
        },
      },
    ],
    './plugins/cloudflare-pages.ts',
  ],

  themes: [
    'docusaurus-theme-openapi-docs',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: true,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexPages: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Tawi',
      logo: {
        alt: 'Tawi',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
        width: 26,
        height: 26,
      },
      items: [
        {type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs'},
        {type: 'docSidebar', sidebarId: 'api', position: 'left', label: 'API reference'},
        {type: 'docSidebar', sidebarId: 'library', position: 'left', label: 'Library'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/changelog', label: 'Changelog', position: 'left'},
        {to: '/download', label: 'Download', position: 'right', className: 'navbar-download'},
        ...(versions.length ? [{type: 'docsVersionDropdown' as const, position: 'right' as const}] : []),
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Install', to: '/docs/start/install'},
            {label: 'Quick start', to: '/docs/start/quickstart'},
            {label: 'Agent API', to: '/docs/guides/agent-api'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Agent API', to: '/docs/api/agent/tawi-agent-api'},
            {label: 'Studio API', to: '/docs/api/studio/tawi-studio-api'},
            {label: 'Library', to: '/docs/library/reference'},
          ],
        },
        {
          title: 'Tawi',
          items: [
            {label: 'Download', to: '/download'},
            {label: 'Blog', to: '/blog'},
            {label: 'Changelog', to: '/changelog'},
            {label: 'Security', to: '/security'},
          ],
        },
        {
          title: 'About',
          items: [
            {label: 'Contact', to: '/contact'},
            {label: 'Privacy', to: '/privacy'},
            {label: 'Terms', to: '/terms'},
          ],
        },
      ],
      copyright: 'Made with ♥ in Toronto',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'python', 'http', 'powershell'],
    },
    languageTabs: [
      {highlight: 'bash', language: 'curl', logoClass: 'curl'},
      {highlight: 'python', language: 'python', logoClass: 'python', variant: 'requests'},
      {highlight: 'javascript', language: 'javascript', logoClass: 'javascript', variant: 'fetch'},
      {highlight: 'powershell', language: 'powershell', logoClass: 'powershell'},
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
