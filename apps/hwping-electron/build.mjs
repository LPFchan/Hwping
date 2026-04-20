#!/usr/bin/env node
// Hwping Electron package build script
// 1. crates/rhwp를 wasm-pack으로 빌드 → pkg/
// 2. rhwp-studio를 Vite로 빌드 → dist/renderer/
// 3. dist/renderer/wasm/에 WASM 번들을 복사

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, chmodSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const DIST = resolve(__dirname, 'dist');
const APP_BUNDLE = resolve(DIST, 'Hwping.app');
const APP_VERSION = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')).version;
const RUSTUP_CARGO = execSync('rustup which cargo', { encoding: 'utf-8' }).trim();
const RUSTUP_BIN = dirname(RUSTUP_CARGO);
const CARGO_HOME_BIN = resolve(homedir(), '.cargo', 'bin');
const WASM_PACK = process.env.WASM_PACK_BIN ?? 'wasm-pack';
const ELECTRON_BIN = resolve(__dirname, 'node_modules', '.bin', 'electron');

function run(cmd, cwd = __dirname, extraEnv = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd, env: { ...process.env, ...extraEnv } });
}

function copy(src, dest) {
  if (!existsSync(src)) {
    console.warn(`  SKIP (not found): ${src}`);
    return;
  }
  cpSync(src, dest, { recursive: true });
  console.log(`  COPY: ${src} → ${dest}`);
}

function writeText(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
}

function makeExecutable(filePath) {
  try {
    chmodSync(filePath, 0o755);
  } catch (error) {
    console.warn(`  CHMOD SKIP: ${filePath} (${error})`);
  }
}

function buildAppBundle() {
  console.log('\n[4/4] Hwping.app 번들 구성...');
  if (existsSync(APP_BUNDLE)) {
    rmSync(APP_BUNDLE, { recursive: true, force: true });
  }

  const contents = resolve(APP_BUNDLE, 'Contents');
  const macos = resolve(contents, 'MacOS');
  const resourcesApp = resolve(contents, 'Resources', 'app');

  mkdirSync(macos, { recursive: true });
  mkdirSync(resourcesApp, { recursive: true });

  writeText(resolve(contents, 'Info.plist'), `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>en</string>
  <key>CFBundleDisplayName</key>
  <string>Hwping</string>
  <key>CFBundleExecutable</key>
  <string>Hwping</string>
  <key>CFBundleIdentifier</key>
  <string>com.lpfchan.hwping</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>Hwping</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>${APP_VERSION}</string>
  <key>CFBundleVersion</key>
  <string>${APP_VERSION}</string>
  <key>LSApplicationCategoryType</key>
  <string>public.app-category.productivity</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>CFBundleDocumentTypes</key>
  <array>
    <dict>
      <key>CFBundleTypeExtensions</key>
      <array>
        <string>hwp</string>
        <string>hwpx</string>
      </array>
      <key>CFBundleTypeName</key>
      <string>HWP Document</string>
      <key>CFBundleTypeRole</key>
      <string>Viewer</string>
      <key>LSHandlerRank</key>
      <string>Owner</string>
    </dict>
  </array>
</dict>
</plist>
`);

  writeText(resolve(macos, 'Hwping'), `#!/bin/sh
set -eu
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ELECTRON_BIN="${ELECTRON_BIN}"

if [ -n "\${HWPING_LAUNCH_LOG:-}" ]; then
  {
    printf '%s [launcher:boot] script_dir=%s pwd=%s argv=%s\n' "$(date -u +%FT%TZ)" "$SCRIPT_DIR" "$(pwd)" "$*"
    printf '%s [launcher:electron] path=%s executable=%s\n' "$(date -u +%FT%TZ)" "$ELECTRON_BIN" "$([ -x "$ELECTRON_BIN" ] && printf yes || printf no)"
  } >> "$HWPING_LAUNCH_LOG" 2>/dev/null || true
fi

if [ ! -x "$ELECTRON_BIN" ]; then
  if [ -n "\${HWPING_LAUNCH_LOG:-}" ]; then
    printf '%s [launcher:error] Electron runtime not found: %s\n' "$(date -u +%FT%TZ)" "$ELECTRON_BIN" >> "$HWPING_LAUNCH_LOG" 2>/dev/null || true
  fi
  echo "Electron runtime not found: $ELECTRON_BIN" >&2
  exit 1
fi

exec "$ELECTRON_BIN" "$SCRIPT_DIR/../Resources/app" "$@"
`);
  makeExecutable(resolve(macos, 'Hwping'));

  copy(resolve(__dirname, 'main.mjs'), resolve(resourcesApp, 'main.mjs'));
  copy(resolve(__dirname, 'preload.mjs'), resolve(resourcesApp, 'preload.mjs'));
  copy(resolve(__dirname, 'menu-model.mjs'), resolve(resourcesApp, 'menu-model.mjs'));
  copy(resolve(__dirname, 'package.json'), resolve(resourcesApp, 'package.json'));
  mkdirSync(resolve(resourcesApp, 'dist'), { recursive: true });
  copy(resolve(DIST, 'renderer'), resolve(resourcesApp, 'dist', 'renderer'));

  console.log(`  APP: ${APP_BUNDLE}`);
}

console.log('=== Hwping Electron 빌드 시작 ===\n');

if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true, force: true });
}

console.log('[1/3] WASM 빌드...');
run('rustup target add wasm32-unknown-unknown', resolve(ROOT, 'crates/rhwp'));
run(
  `${WASM_PACK} build --target web --release --out-dir ../../pkg`,
  resolve(ROOT, 'crates/rhwp'),
  { PATH: `${RUSTUP_BIN}:${CARGO_HOME_BIN}:${process.env.PATH}` },
);

console.log('\n[2/3] Renderer 빌드...');
run(`npx vite build --config ${resolve(__dirname, 'vite.renderer.config.mjs')}`);

console.log('\n[3/3] WASM 번들 복사...');
mkdirSync(resolve(DIST, 'renderer', 'wasm'), { recursive: true });
copy(resolve(ROOT, 'pkg', 'rhwp.js'), resolve(DIST, 'renderer', 'wasm', 'rhwp.js'));
copy(resolve(ROOT, 'pkg', 'rhwp.d.ts'), resolve(DIST, 'renderer', 'wasm', 'rhwp.d.ts'));
copy(resolve(ROOT, 'pkg', 'rhwp_bg.wasm'), resolve(DIST, 'renderer', 'wasm', 'rhwp_bg.wasm'));
copy(resolve(ROOT, 'pkg', 'rhwp_bg.wasm.d.ts'), resolve(DIST, 'renderer', 'wasm', 'rhwp_bg.wasm.d.ts'));

buildAppBundle();

console.log('\n=== 빌드 완료 ===');
console.log(`출력: ${DIST}`);
