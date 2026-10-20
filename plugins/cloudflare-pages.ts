import fs from 'node:fs';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';

// Writes Cloudflare Pages' _redirects and _headers into the build.
//
// The studio links to the docs of its own version: /docs/<version>/... A released version that is the newest is
// served at /docs/... (no version in the path), so its versioned paths redirect there.
export default function cloudflarePages(context: LoadContext): Plugin {
  return {
    name: 'cloudflare-pages',
    async postBuild({outDir}) {
      const file = path.join(context.siteDir, 'versions.json');
      const versions: string[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
      const redirects = [
        '/docs/latest /docs 302',
        '/docs/latest/* /docs/:splat 302',
        ...(versions.length
          ? [`/docs/${versions[0]} /docs 302`, `/docs/${versions[0]}/* /docs/:splat 302`]
          : ['/docs/next /docs 302', '/docs/next/* /docs/:splat 302']),
      ];
      fs.writeFileSync(path.join(outDir, '_redirects'), redirects.join('\n') + '\n');
      const headers = [
        '/*',
        '  X-Content-Type-Options: nosniff',
        '  Referrer-Policy: strict-origin-when-cross-origin',
        '  X-Frame-Options: DENY',
        '/assets/*',
        '  Cache-Control: public, max-age=31536000, immutable',
      ];
      fs.writeFileSync(path.join(outDir, '_headers'), headers.join('\n') + '\n');
    },
  };
}
