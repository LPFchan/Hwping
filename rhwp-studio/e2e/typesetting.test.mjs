/**
 * E2E 테스트: 조판 품질 검증 (문단부호 표시 상태)
 *
 * 사전 조건: Vite dev server 실행 중 (npm run dev)
 * 실행: node e2e/typesetting.test.mjs
 */
import { launchBrowser, loadApp, clickEditArea, typeText, screenshot, assert } from './helpers.mjs';

async function run() {
  console.log('=== E2E: 조판 품질 검증 (문단부호 ON) ===\n');

  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // ── 앱 로드 + 새 문서 ──
    await loadApp(page);
    await page.evaluate(() => window.__eventBus?.emit('create-new-document'));
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    // ── 문단부호 켜기 ──
    console.log('[1] 문단부호 켜기...');
    await page.evaluate(() => {
      window.__wasm?.setShowParagraphMarks(true);
      window.__eventBus?.emit('document-changed');
    });
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await screenshot(page, 'ts-01-paramark-empty');

    // ── 편집 영역 클릭 ──
    await clickEditArea(page);

    // ── 한 줄 텍스트 + 문단부호 확인 ──
    console.log('\n[2] 한 줄 텍스트 + 문단부호...');
    await typeText(page, 'Hello World');
    await screenshot(page, 'ts-02-single-line');

    // ── 여러 줄 텍스트 (줄바꿈) ──
    console.log('\n[3] 자동 줄바꿈 (긴 텍스트)...');
    const longText = 'The quick brown fox jumps over the lazy dog. ';
    for (let i = 0; i < 5; i++) {
      await typeText(page, longText);
    }
    await screenshot(page, 'ts-03-line-wrap');

    // ── Enter로 문단 분리 (3개 문단) ──
    console.log('\n[4] 문단 분리 (Enter 3회)...');
    await page.keyboard.press('Enter');
    await page.evaluate(() => new Promise(r => setTimeout(r, 100)));
    await typeText(page, 'Second paragraph with some text.');
    await page.keyboard.press('Enter');
    await page.evaluate(() => new Promise(r => setTimeout(r, 100)));
    await typeText(page, 'Third paragraph.');
    await screenshot(page, 'ts-04-multi-paragraph');

    // ── 빈 줄 (Enter만) ──
    console.log('\n[5] 빈 줄 + 텍스트 교차...');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await typeText(page, 'After two blank lines.');
    await page.keyboard.press('Enter');
    await typeText(page, 'Next line.');
    await screenshot(page, 'ts-05-blank-lines');

    // ── 줄간격 확인 (여러 문단) ──
    console.log('\n[6] 줄간격 + 페이지 경계...');
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Enter');
    }
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await typeText(page, 'Text on page 2.');

    const pageCount = await page.evaluate(() => window.__wasm?.pageCount ?? 0);
    console.log(`  페이지 수: ${pageCount}`);
    assert(pageCount >= 2, `페이지 넘김 확인 (${pageCount}페이지)`);
    await screenshot(page, 'ts-06-page-boundary');

    // ── 1페이지 상단으로 스크롤 ──
    console.log('\n[7] 1페이지 상단 전체 뷰...');
    await page.evaluate(() => {
      document.getElementById('scroll-container')?.scrollTo(0, 0);
    });
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));
    await screenshot(page, 'ts-07-page1-top');

    // ── Backspace로 문단 병합 후 확인 ──
    console.log('\n[8] 문단 병합 후 조판 확인...');
    // Ctrl+Home으로 문서 시작으로 이동
    await page.keyboard.down('Control');
    await page.keyboard.press('Home');
    await page.keyboard.up('Control');
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

    // End로 첫 문단 끝으로 이동 후 Delete로 다음 문단 병합
    await page.keyboard.press('End');
    await page.keyboard.press('Delete');
    await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
    await screenshot(page, 'ts-08-after-merge');

    console.log('\n=== 조판 검증 완료 ===');
    console.log('스크린샷을 확인하여 조판 품질을 점검하세요.');
  } catch (error) {
    console.error('테스트 오류:', error.message);
    await screenshot(page, 'ts-error');
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
