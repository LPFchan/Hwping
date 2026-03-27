/**
 * E2E 테스트: biz_plan.hwp 강제 쪽 나누기
 * "5. 사업추진조직" 문단 앞에 쪽 나누기 삽입 후 페이지 재배치 확인
 *
 * 실행: node e2e/page-break.test.mjs --mode=headless
 */
import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

async function run() {
  console.log('=== E2E: 강제 쪽 나누기 테스트 ===\n');

  const browser = await launchBrowser();
  const page = await createPage(browser, 1280, 900);

  try {
    console.log('[1] 앱 로드 + biz_plan.hwp 로드...');
    await loadApp(page);
    const loadResult = await page.evaluate(async () => {
      const resp = await fetch('/samples/biz_plan.hwp');
      const buf = await resp.arrayBuffer();
      const docInfo = window.__wasm?.loadDocument(new Uint8Array(buf), 'biz_plan.hwp');
      window.__canvasView?.loadDocument?.();
      return docInfo;
    });
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
    console.log(`  페이지 수: ${loadResult?.pageCount}`);
    const beforePages = loadResult?.pageCount ?? 0;
    assert(beforePages >= 3, `문서 로드 성공 (${beforePages}페이지)`);
    await screenshot(page, 'pb-01-loaded');

    // "5. 사업추진조직" = 문단 68 확인
    const paraText = await page.evaluate(() => {
      try { return window.__wasm?.getTextRange(0, 68, 0, 20); } catch { return 'ERR'; }
    });
    console.log(`  문단 68 텍스트: "${paraText}"`);
    assert(paraText?.includes('사업추진조직'), '문단 68 = "5. 사업추진조직"');

    // 삽입 전 문단 68의 페이지 확인
    const beforeRect = await page.evaluate(() => {
      try { return JSON.parse(window.__wasm?.doc.getCursorRect(0, 68, 0)); } catch { return null; }
    });
    console.log(`  삽입 전 문단 68 위치: page=${beforeRect?.pageIndex}, y=${beforeRect?.y?.toFixed(1)}`);

    // 강제 쪽 나누기 삽입
    console.log('\n[2] 강제 쪽 나누기 삽입 (sec=0, para=68, offset=0)...');
    const breakResult = await page.evaluate(() => {
      try {
        const r = JSON.parse((window.__wasm?.doc).insertPageBreak(0, 68, 0));
        window.__eventBus?.emit('document-changed');
        return r;
      } catch (e) { return { error: e.message }; }
    });
    console.log(`  결과: ${JSON.stringify(breakResult)}`);
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    await screenshot(page, 'pb-02-after-break');

    // 삽입 후 페이지 수 확인
    const afterPages = await page.evaluate(() => window.__wasm?.pageCount ?? 0);
    console.log(`\n[3] 삽입 후 페이지 수: ${afterPages} (이전: ${beforePages})`);
    assert(afterPages > beforePages, `페이지 증가: ${beforePages} → ${afterPages}`);

    // "5. 사업추진조직"이 새 페이지 시작에 위치하는지 확인
    // 문단 분할로 새 문단 69가 생성됨 (원래 68의 텍스트가 69로 이동)
    const afterRect = await page.evaluate(() => {
      try { return JSON.parse(window.__wasm?.doc.getCursorRect(0, 69, 0)); } catch { return null; }
    });
    console.log(`  삽입 후 "5. 사업추진조직" (문단 69): page=${afterRect?.pageIndex}, y=${afterRect?.y?.toFixed(1)}`);

    if (beforeRect && afterRect) {
      assert(afterRect.pageIndex > beforeRect.pageIndex,
        `"사업추진조직"이 다음 페이지로 이동 (page ${beforeRect.pageIndex} → ${afterRect.pageIndex})`);
    }

    // 후속 문단들이 자연스럽게 재배치되었는지 확인
    console.log('\n[4] 후속 문단 위치 확인...');
    const postBreakPositions = await page.evaluate(() => {
      const results = [];
      for (let pi = 69; pi <= 75; pi++) {
        try {
          const r = JSON.parse(window.__wasm?.doc.getCursorRect(0, pi, 0));
          results.push({ pi, page: r.pageIndex, y: r.y.toFixed(1) });
        } catch (e) {
          results.push({ pi, err: e.message?.substring(0, 40) });
        }
      }
      return results;
    });
    for (const p of postBreakPositions) {
      console.log(`  문단 ${p.pi}: ${p.err ? 'ERR' : `page=${p.page} y=${p.y}`}`);
    }

    // 페이지 순서가 연속적인지 확인
    let prevPage = -1;
    let orderOk = true;
    for (const p of postBreakPositions) {
      if (p.err) continue;
      if (p.page < prevPage) { orderOk = false; break; }
      prevPage = p.page;
    }
    assert(orderOk, '후속 문단 페이지 순서 정상');

    console.log('\n=== 테스트 완료 ===');
  } catch (err) {
    console.error('오류:', err);
    process.exitCode = 1;
  } finally {
    await screenshot(page, 'pb-final');
    await closeBrowser(browser);
  }
}

run().catch(console.error);
