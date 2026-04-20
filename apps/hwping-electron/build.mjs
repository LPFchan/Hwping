#!/usr/bin/env node
// Hwping Electron package build script
// 1. crates/rhwp를 wasm-pack으로 빌드 → pkg/
// 2. rhwp-studio를 Vite로 빌드 → dist/renderer/
// 3. dist/renderer/wasm/에 WASM 번들을 복사

import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const DIST = resolve(__dirname, 'dist');
const RUSTUP_CARGO = execSync('rustup which cargo', { encoding: 'utf-8' }).trim();
const RUSTUP_BIN = dirname(RUSTUP_CARGO);
const CARGO_HOME_BIN = resolve(homedir(), '.cargo', 'bin');
const WASM_PACK = process.env.WASM_PACK_BIN ?? 'wasm-pack';

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

console.log('\n=== 빌드 완료 ===');
console.log(`출력: ${DIST}`);
