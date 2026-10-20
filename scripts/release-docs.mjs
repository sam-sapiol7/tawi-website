#!/usr/bin/env node
// Freeze the docs in docs/ as a released version, so studios of that version keep linking to matching pages.
//
//   node scripts/release-docs.mjs 0.2.0
//
// Run after sync-docs.mjs has copied that release's docs. Regenerates the API reference from the release's specs,
// then copies docs/ to versioned_docs/version-<v>/ (Docusaurus' docs:version). The newest version is served at
// /docs, older ones at /docs/<v>, and docs/ itself at /docs/next until the next release.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('usage: release-docs.mjs MAJOR.MINOR.PATCH');
  process.exit(2);
}
const synced = fs.existsSync('tawi-version.txt') ? fs.readFileSync('tawi-version.txt', 'utf8').trim() : '';
if (synced !== version) {
  console.error(`docs/ holds the docs of Tawi ${synced || '(unknown)'}, not ${version}: run sync-docs.mjs first`);
  process.exit(1);
}
const versions = fs.existsSync('versions.json') ? JSON.parse(fs.readFileSync('versions.json', 'utf8')) : [];
if (versions.includes(version)) {
  console.log(`${version} is already released here; nothing to do`);
  process.exit(0);
}
const run = (...a) => execFileSync('npx', ['docusaurus', ...a], {stdio: 'inherit', shell: process.platform === 'win32'});
run('clean-api-docs', 'all');
run('gen-api-docs', 'all');
run('docs:version', version);
console.log(`released the docs of ${version}`);
