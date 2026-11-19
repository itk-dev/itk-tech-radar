// Fetches the ITK Aarhus design system payload at the version pinned in
// package.json ("config.designSystemVersion") into vendor/itkaarhus-design-system/.
//
// The design system ships as a Composer dist archive (assets/ only; package.json
// is export-ignored), so it cannot be installed with npm. We download the same
// archive GitHub serves for the tag. The favicon and the Aarhus Kommune
// endorsement lockup live outside that payload, so they are fetched from the
// tagged source tree.
//
// To try unreleased design system changes, point ITKAARHUS_DS_DIR at a local
// checkout: `ITKAARHUS_DS_DIR=../itkaarhus-design-system npm run dev`. The
// files are copied from there instead, on every run; the next run without the
// variable restores the pinned version.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { config } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const version = config?.designSystemVersion;
if (!version) {
  throw new Error('package.json is missing config.designSystemVersion');
}

const repo = 'itk-dev/itkaarhus-design-system';
const target = join(root, 'vendor', 'itkaarhus-design-system');
const marker = join(target, '.version');
const extraFiles = ['public/assets/logos/aak-favicon.ico', 'public/assets/logos/AAK_02_venstrejusteret_hvid.svg'];

const localDir = process.env.ITKAARHUS_DS_DIR;
if (localDir) {
  const source = resolve(localDir);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(join(target, 'extra'), { recursive: true });
  cpSync(join(source, 'assets'), join(target, 'assets'), { recursive: true });
  for (const file of extraFiles) {
    cpSync(join(source, file), join(target, 'extra', file.split('/').pop()));
  }
  writeFileSync(marker, `local:${source}\n`);
  console.log(`Synced itkaarhus-design-system from local checkout ${source}`);
  process.exit(0);
}

if (existsSync(marker) && readFileSync(marker, 'utf8').trim() === version) {
  process.exit(0);
}

const download = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
};

// Download everything before touching vendor/, so a failed download (e.g. an
// unreleased version) leaves the current copy in place.
const archiveBody = await download(`https://codeload.github.com/${repo}/tar.gz/refs/tags/${version}`);
const extraBodies = await Promise.all(
  extraFiles.map((file) => download(`https://raw.githubusercontent.com/${repo}/${version}/${file}`)),
);

rmSync(target, { recursive: true, force: true });
mkdirSync(join(target, 'extra'), { recursive: true });

const archive = join(target, 'payload.tar.gz');
writeFileSync(archive, archiveBody);
execFileSync('tar', ['-xzf', archive, '-C', target, '--strip-components=1']);
rmSync(archive);

extraFiles.forEach((file, i) => writeFileSync(join(target, 'extra', file.split('/').pop()), extraBodies[i]));

writeFileSync(marker, `${version}\n`);
console.log(`Synced ${repo}@${version}`);
