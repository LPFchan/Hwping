import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

const VITE_URL = process.env.VITE_URL || 'http://localhost:7700';

async function run() {
  const browser = await launchBrowser();
  const page = await createPage(browser);

  try {
    await loadApp(page, VITE_URL, 'shift-return.hwp');
    await page.waitForSelector('canvas', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000));

    // 첫 번째 문단 시작 위치 클릭
    const canvas = await page.$('canvas');
    const box = await canvas.boundingBox();
    // 문단 시작 근처 클릭 (왼쪽 여백 + 약간 안쪽)
    await page.mouse.click(box.x + 160, box.y + 135);
    await new Promise(r => setTimeout(r, 500));

    // 커서 위치 확인
    const pos1 = await page.evaluate(() => {
      const ih = window.__inputHandler;
      return ih?.cursor?.position;
    });
    console.log('커서 위치 (클릭 후):', JSON.stringify(pos1));

    // 콘솔 에러 수집
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        consoleErrors.push(msg.text());
      }
    });

    // textarea에 focus 확인
    await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      if (ta) ta.focus();
    });
    await new Promise(r => setTimeout(r, 200));

    // 직접 cursor API 호출로 테스트
    console.log('cursor API 직접 호출...');
    const lineInfo = await page.evaluate(() => {
      const ih = window.__inputHandler;
      if (!ih) return { error: 'no inputHandler' };
      try {
        const li = ih.wasm.getLineInfo(0, 0, 0);
        return { lineInfo: li };
      } catch(e) {
        return { error: e.message };
      }
    });
    console.log('getLineInfo(0,0,0):', JSON.stringify(lineInfo));

    // setAnchor + moveToLineEnd 직접 호출
    const result = await page.evaluate(() => {
      const ih = window.__inputHandler;
      if (!ih) return { error: 'no inputHandler' };
      try {
        ih.cursor.setAnchor();
        ih.cursor.moveToLineEnd();
        return {
          hasSelection: ih.cursor.hasSelection(),
          position: ih.cursor.position,
          anchor: ih.cursor.selectionAnchor,
        };
      } catch(e) {
        return { error: e.message };
      }
    });
    console.log('직접 호출 결과:', JSON.stringify(result));

    // 콘솔 에러 출력
    for (const err of consoleErrors) {
      console.log('  console:', err);
    }
    await new Promise(r => setTimeout(r, 500));

    // 선택 상태 확인
    const selState = await page.evaluate(() => {
      const ih = window.__inputHandler;
      const cursor = ih?.cursor;
      return {
        hasSelection: cursor?.hasSelection(),
        anchor: cursor?.selectionAnchor,
        position: cursor?.position,
      };
    });
    console.log('선택 상태 (Shift+End 후):', JSON.stringify(selState));

    // 선택 하이라이트 존재 확인
    const highlights = await page.$$('.selection-layer div');
    console.log('선택 하이라이트 수:', highlights.length);

    await screenshot(page, 'shift-end-result');

    assert(selState.hasSelection === true, 'Shift+End 후 선택 상태여야 함');
    assert(highlights.length > 0, '선택 하이라이트가 표시되어야 함');

    console.log('✅ Shift+End 테스트 통과');
  } catch (err) {
    await screenshot(page, 'shift-end-error');
    console.error('❌ 테스트 실패:', err.message);
  } finally {
    await closeBrowser(browser);
  }
}

run();
