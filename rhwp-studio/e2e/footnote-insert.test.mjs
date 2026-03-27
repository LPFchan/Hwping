/**
 * E2E 테스트: footnote-01.hwp 각주 삽입 시 문단 위치 이상 확인
 *
 * 재현 절차:
 *   1. footnote-01.hwp 로드
 *   2. "원료를" 뒤에 커서 위치 (문단 0.3, charOffset ≈ 14)
 *   3. 스페이스 입력
 *   4. 다음 문단의 y 위치가 비정상적으로 변경되는지 확인
 *
 * 실행: node e2e/footnote-insert.test.mjs --mode=headless
 */
import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

async function run() {
  console.log('=== E2E: footnote-01.hwp 스페이스 입력 시 문단 위치 이상 확인 ===\n');

  const browser = await launchBrowser();
  const page = await createPage(browser, 1280, 900);

  try {
    // ── 1. 앱 로드 ──
    console.log('[1] 앱 로드...');
    await loadApp(page);
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

    // ── 2. footnote-01.hwp 파일 로드 ──
    console.log('[2] footnote-01.hwp 파일 로드...');
    const loadResult = await page.evaluate(async () => {
      try {
        const resp = await fetch('/samples/footnote-01.hwp');
        if (!resp.ok) return { error: `HTTP ${resp.status}` };
        const buf = await resp.arrayBuffer();
        const data = new Uint8Array(buf);
        const docInfo = window.__wasm?.loadDocument(data, 'footnote-01.hwp');
        if (!docInfo) return { error: 'loadDocument returned null' };
        const cv = window.__canvasView;
        if (cv?.loadDocument) cv.loadDocument();
        return {
          pageCount: docInfo.pageCount,
          sectionCount: docInfo.sectionCount,
        };
      } catch (e) {
        return { error: e.message || String(e) };
      }
    });

    if (loadResult.error) {
      console.error(`  파일 로드 실패: ${loadResult.error}`);
      process.exitCode = 1;
      return;
    }
    console.log(`  페이지 수: ${loadResult.pageCount}`);
    assert(loadResult.pageCount >= 1, '문서 로드 성공');
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    await screenshot(page, 'fn-01-loaded');

    // ── 3. 삽입 전 문단 위치 수집 ──
    console.log('\n[3] 삽입 전 문단 위치 수집...');
    const beforePositions = await page.evaluate(() => {
      const w = window.__wasm;
      if (!w) return null;
      const results = [];
      for (let pi = 0; pi <= 6; pi++) {
        try {
          const rect = JSON.parse(w.doc.getCursorRect(0, pi, 0));
          results.push({ para: pi, y: rect.y, pageIndex: rect.pageIndex });
        } catch (e) {
          results.push({ para: pi, error: e.message });
        }
      }
      return results;
    });
    console.log('  삽입 전 문단 y 위치:');
    if (beforePositions) {
      for (const p of beforePositions) {
        if (p.error) {
          console.log(`    문단 ${p.para}: ERROR ${p.error}`);
        } else {
          console.log(`    문단 ${p.para}: y=${p.y.toFixed(1)}, page=${p.pageIndex}`);
        }
      }
    }

    // ── 4. "원료를" 뒤에 커서 위치 (문단 3, "원료를" = 위치 14) ──
    console.log('\n[4] "원료를" 뒤에 커서 위치...');
    // 텍스트: "플라스틱 액체와 같은 원료를 사출해..."
    // 플(0)라(1)스(2)틱(3) (4)액(5)체(6)와(7) (8)같(9)은(10) (11)원(12)료(13)를(14)
    // charOffset=15 = "를" 다음 = 스페이스 위치
    const clickResult = await page.evaluate(() => {
      const w = window.__wasm;
      if (!w) return { error: 'wasm not available' };
      try {
        // hitTest로 문단 3, charOffset 14 근처 클릭
        const rect = JSON.parse(w.doc.getCursorRect(0, 3, 14));
        return { ...rect, charOffset: 14, paraIdx: 3 };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log(`  커서 위치: ${JSON.stringify(clickResult)}`);

    // 편집 영역 클릭하여 커서 배치
    if (clickResult && !clickResult.error) {
      // 캔버스에서 해당 좌표 클릭
      const canvasBox = await (await page.$('canvas')).boundingBox();
      const zoom = await page.evaluate(() => window.__canvasView?.getZoom?.() ?? 1.0);
      const scrollY = await page.evaluate(() => {
        const sc = document.querySelector('#scroll-container');
        return sc ? sc.scrollTop : 0;
      });

      // 페이지 오프셋 계산
      const pageOffset = await page.evaluate((pageIdx) => {
        return window.__canvasView?.virtualScroll?.getPageOffset?.(pageIdx) ?? 0;
      }, clickResult.pageIndex);

      const clickX = canvasBox.x + clickResult.x * zoom;
      const clickY = canvasBox.y + (pageOffset + clickResult.y) * zoom - scrollY;

      console.log(`  클릭 좌표: (${clickX.toFixed(1)}, ${clickY.toFixed(1)})`);
      await page.mouse.click(clickX, clickY);
      await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    }

    // ── 5. 스페이스 입력 ──
    console.log('\n[5] 스페이스 입력...');
    await page.keyboard.press('Space');
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await screenshot(page, 'fn-02-after-space');

    // ── 6. 삽입 후 문단 위치 수집 ──
    console.log('\n[6] 삽입 후 문단 위치 수집...');
    const afterPositions = await page.evaluate(() => {
      const w = window.__wasm;
      if (!w) return null;
      const results = [];
      for (let pi = 0; pi <= 6; pi++) {
        try {
          const rect = JSON.parse(w.doc.getCursorRect(0, pi, 0));
          results.push({ para: pi, y: rect.y, pageIndex: rect.pageIndex });
        } catch (e) {
          results.push({ para: pi, error: e.message });
        }
      }
      return results;
    });
    console.log('  삽입 후 문단 y 위치:');
    if (afterPositions) {
      for (const p of afterPositions) {
        if (p.error) {
          console.log(`    문단 ${p.para}: ERROR ${p.error}`);
        } else {
          console.log(`    문단 ${p.para}: y=${p.y.toFixed(1)}, page=${p.pageIndex}`);
        }
      }
    }

    // ── 7. 위치 비교 ──
    console.log('\n[7] 위치 비교...');
    if (beforePositions && afterPositions) {
      for (let i = 0; i < Math.min(beforePositions.length, afterPositions.length); i++) {
        const b = beforePositions[i];
        const a = afterPositions[i];
        if (b.error || a.error) continue;
        const diff = Math.abs(a.y - b.y);
        const status = diff > 50 ? 'ABNORMAL' : 'ok';
        console.log(`    문단 ${i}: before=${b.y.toFixed(1)} after=${a.y.toFixed(1)} diff=${diff.toFixed(1)} ${status}`);
        if (diff > 50) {
          assert(false, `문단 ${i}의 y 위치가 비정상적으로 변경됨 (${diff.toFixed(1)}px)`);
        }
      }
    }

    console.log('\n=== 테스트 완료 ===');

  } catch (err) {
    console.error('테스트 실행 오류:', err);
    process.exitCode = 1;
  } finally {
    await screenshot(page, 'fn-final');
    await closeBrowser(browser);
  }
}

run().catch(console.error);
