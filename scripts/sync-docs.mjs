#!/usr/bin/env node
// Copy the docs a Tawi version publishes into this site.
//
//   node scripts/sync-docs.mjs --tawi ../antahkarana     # from a Tawi checkout (runs its scripts/export_site_docs.py)
//   node scripts/sync-docs.mjs tawi-docs-0.2.0.tar.gz    # from a release's docs archive
//   node scripts/sync-docs.mjs path/to/export            # from an exported folder
//
// Replaces docs/start, docs/guides, docs/library, static/openapi/ and src/pages/changelog.md. The pages this site owns
// (docs/intro.md, docs/api/index.md) are left alone. Run `npm run gen-api` afterwards (npm run build does).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: sync-docs.mjs (--tawi CHECKOUT | ARCHIVE.tar.gz | EXPORT_DIR)');
  process.exit(2);
}

let src;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tawi-docs-'));
if (args[0] === '--tawi') {
  const checkout = path.resolve(args[1]);
  const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  execFileSync(python, [path.join(checkout, 'scripts', 'export_site_docs.py'), tmp], {stdio: 'inherit', cwd: checkout});
  src = tmp;
} else if (args[0].endsWith('.tar.gz') || args[0].endsWith('.tgz')) {
  execFileSync('tar', ['-xzf', path.resolve(args[0]), '-C', tmp], {stdio: 'inherit'});
  const inner = fs.readdirSync(tmp);
  src = inner.length === 1 && fs.statSync(path.join(tmp, inner[0])).isDirectory() ? path.join(tmp, inner[0]) : tmp;
} else {
  src = path.resolve(args[0]);
}

for (const need of ['VERSION', 'openapi/agent.yaml', 'openapi/studio.yaml', 'docs', 'CHANGELOG.md']) {
  if (!fs.existsSync(path.join(src, need))) {
    console.error(`${src} has no ${need}: is it a Tawi docs export?`);
    process.exit(1);
  }
}

const version = fs.readFileSync(path.join(src, 'VERSION'), 'utf8').trim();
for (const dir of ['start', 'guides', 'library']) {
  fs.rmSync(path.join(site, 'docs', dir), {recursive: true, force: true});
  fs.cpSync(path.join(src, 'docs', dir), path.join(site, 'docs', dir), {recursive: true});
}
fs.rmSync(path.join(site, 'static', 'openapi'), {recursive: true, force: true});
fs.cpSync(path.join(src, 'openapi'), path.join(site, 'static', 'openapi'), {recursive: true});

const changelog = fs.readFileSync(path.join(src, 'CHANGELOG.md'), 'utf8').replace(/^# Changelog\n/, '');
fs.writeFileSync(
  path.join(site, 'src', 'pages', 'changelog.md'),
  `---\ntitle: Changelog\ndescription: What changed in each version of Tawi.\n---\n\n# Changelog\n${changelog}`,
);
fs.writeFileSync(path.join(site, 'tawi-version.txt'), version + '\n');
fs.rmSync(tmp, {recursive: true, force: true});
console.log(`synced the docs of Tawi ${version}`);
