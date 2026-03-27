/**
 * E2E 테스트: 텍스트 블럭 복사/붙여넣기 버그 (Task 227)
 *
 * 시나리오: 빈 문서 → 'abcdefg' 입력 → 전체 선택(Ctrl+A) →
 *           복사(Ctrl+C) → End → 붙여넣기(Ctrl+V) →
 *           페이지 수가 1페이지인지 확인
 *
 * (한글 IME는 headless Chrome에서 동작하지 않으므로 영문으로 테스트)
 */
import {
  launchBrowser, createPage, closeBrowser,
  loadApp, clickEditArea, typeText,
  screenshot, assert,
} from './helpers.mjs';

async function main() {
  console.log('=== 복사/붙여넣기 테스트 (Task 227) ===');

  const browser = await launchBrowser();
  const page = await createPage(browser);

  try {
    // 1. 앱 로드 + 빈 문서 생성
    await loadApp(page);
    await page.evaluate(() => {
      window.__eventBus?.emit('create-new-document');
    });
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    const initPages = await page.evaluate(() => window.__wasm?.pageCount ?? 0);
    assert(initPages >= 1, `빈 문서 페이지 수 = ${initPages}`);
    console.log('  [1] 빈 문서 생성 완료');

    // 2. 편집 영역 클릭 + 텍스트 입력
    await clickEditArea(page);
    await typeText(page, 'abcdefg');
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await screenshot(page, 'cp-01-typed');

    // 문단 텍스트 확인
    const text1 = await page.evaluate(() => {
      try { return window.__wasm?.getTextRange(0, 0, 0, 100) ?? 'N/A'; }
      catch { return 'ERROR'; }
    });
    console.log(`  [2] 입력 후 텍스트: "${text1}"`);
    assert(text1.includes('abcdefg'), `텍스트 입력 확인: ${text1}`);

    let pageCount = await page.evaluate(() => window.__wasm?.pageCount ?? 0);
    assert(pageCount === 1, `입력 후 페이지 수 = ${pageCount} (기대: 1)`);

    // 3. 전체 선택 (Ctrl+A)
    await page.keyboard.down('Control');
    await page.keyboard.press('a');
    await page.keyboard.up('Control');
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    console.log('  [3] 전체 선택 (Ctrl+A)');

    // 4. 복사 (Ctrl+C)
    await page.keyboard.down('Control');
    await page.keyboard.press('c');
    await page.keyboard.up('Control');
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    console.log('  [4] 복사 (Ctrl+C)');

    // 5. End 키로 선택 해제 + 줄 끝으로 이동
    await page.keyboard.press('End');
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    console.log('  [5] End 키 (선택 해제)');

    // 6. 붙여넣기 (Ctrl+V)
    await page.keyboard.down('Control');
    await page.keyboard.press('v');
    await page.keyboard.up('Control');
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await screenshot(page, 'cp-02-pasted');
    console.log('  [6] 붙여넣기 (Ctrl+V)');

    // 7. 페이지 수 확인 — 1페이지여야 함
    pageCount = await page.evaluate(() => window.__wasm?.pageCount ?? 0);
    assert(pageCount === 1, `붙여넣기 후 페이지 수 = ${pageCount} (기대: 1)`);

    // 8. 문단 수 확인 — 1개여야 함
    const paraCount = await page.evaluate(() => window.__wasm?.getParagraphCount(0) ?? -1);
    assert(paraCount === 1, `붙여넣기 후 문단 수 = ${paraCount} (기대: 1)`);

    // 9. 문단 텍스트 확인
    const text2 = await page.evaluate(() => {
      try { return window.__wasm?.getTextRange(0, 0, 0, 100) ?? 'N/A'; }
      catch { return 'ERROR'; }
    });
    console.log(`  [9] 붙여넣기 후 텍스트: "${text2}"`);
    assert(text2.includes('abcdefgabcdefg'), `텍스트 이어 붙여짐 확인: ${text2}`);

    await screenshot(page, 'cp-03-final');

  } catch (err) {
    console.error('  ERROR:', err.message);
    await screenshot(page, 'cp-error');
    process.exitCode = 1;
  } finally {
    if (browser._isRemote) {
      await page.close();
    }
    await closeBrowser(browser);
  }

  console.log('=== 테스트 완료 ===');
}

main();
