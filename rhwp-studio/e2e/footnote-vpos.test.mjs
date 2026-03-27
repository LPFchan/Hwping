/**
 * E2E 테스트: footnote-01.hwp "원료를" 뒤 스페이스 입력 시 문단 위치 이상
 * WASM API 직접 호출로 정확한 재현
 */
import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

async function run() {
  console.log('=== E2E: footnote-01 vpos 이상 테스트 (API 직접 호출) ===\n');

  const browser = await launchBrowser();
  const page = await createPage(browser, 1280, 900);

  try {
    console.log('[1] 앱 로드 + 문서 로드...');
    await loadApp(page);
    await page.evaluate(async () => {
      const resp = await fetch('/samples/footnote-01.hwp');
      const buf = await resp.arrayBuffer();
      window.__wasm?.loadDocument(new Uint8Array(buf), 'footnote-01.hwp');
      window.__canvasView?.loadDocument?.();
    });
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
    await screenshot(page, 'vpos-01-loaded');

    // 삽입 전 문단 0~10의 y 위치
    console.log('\n[2] 삽입 전 문단 위치...');
    const before = await page.evaluate(() => {
      const w = window.__wasm;
      const result = [];
      for (let pi = 0; pi <= 10; pi++) {
        try {
          const r = JSON.parse(w.doc.getCursorRect(0, pi, 0));
          result.push({ pi, y: r.y, page: r.pageIndex });
        } catch (e) {
          result.push({ pi, err: e.message?.substring(0, 60) });
        }
      }
      return result;
    });
    for (const p of before) {
      console.log(`  문단 ${p.pi}: ${p.err ? 'ERR ' + p.err : `y=${p.y?.toFixed(1)} page=${p.page}`}`);
    }

    // 문단 3 텍스트 확인
    const paraText = await page.evaluate(() => {
      try { return window.__wasm?.getTextRange(0, 3, 0, 100); } catch { return 'ERR'; }
    });
    console.log(`\n  문단 3 텍스트: "${paraText?.substring(0, 40)}..."`);

    // "원료를" 뒤 = charOffset 14 위치에서 "를" 다음 스페이스 위치
    // 플(0)라(1)스(2)틱(3) (4)액(5)체(6)와(7) (8)같(9)은(10) (11)원(12)료(13)를(14)
    console.log('\n[3] WASM API로 스페이스 직접 삽입 (sec=0, para=3, offset=14)...');
    const insertResult = await page.evaluate(() => {
      try {
        const r = window.__wasm?.insertText(0, 3, 14, ' ');
        window.__eventBus?.emit('document-changed');
        return r;
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log(`  insertText 결과: ${JSON.stringify(insertResult)}`);
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    await screenshot(page, 'vpos-02-after-space');

    // 삽입 후 문단 위치
    console.log('\n[4] 삽입 후 문단 위치...');
    const after = await page.evaluate(() => {
      const w = window.__wasm;
      const result = [];
      for (let pi = 0; pi <= 10; pi++) {
        try {
          const r = JSON.parse(w.doc.getCursorRect(0, pi, 0));
          result.push({ pi, y: r.y, page: r.pageIndex });
        } catch (e) {
          result.push({ pi, err: e.message?.substring(0, 60) });
        }
      }
      return result;
    });
    for (const p of after) {
      console.log(`  문단 ${p.pi}: ${p.err ? 'ERR ' + p.err : `y=${p.y?.toFixed(1)} page=${p.page}`}`);
    }

    // 비교
    console.log('\n[5] 위치 비교...');
    let hasBug = false;
    for (let i = 0; i < Math.min(before.length, after.length); i++) {
      const b = before[i], a = after[i];
      if (b.err || a.err) continue;
      const diff = Math.abs(a.y - b.y);
      const status = diff > 30 ? '** ABNORMAL **' : 'ok';
      if (diff > 1) {
        console.log(`  문단 ${i}: ${b.y.toFixed(1)} → ${a.y.toFixed(1)} (diff=${diff.toFixed(1)}) ${status}`);
      }
      if (diff > 30) hasBug = true;
    }
    assert(!hasBug, '문단 위치 비정상 변경 없음');

    console.log('\n=== 테스트 완료 ===');
  } catch (err) {
    console.error('오류:', err);
    process.exitCode = 1;
  } finally {
    await screenshot(page, 'vpos-final');
    await closeBrowser(browser);
  }
}

run().catch(console.error);
