/**
 * E2E 테스트: 도형 인라인 컨트롤 — 커서 이동 및 텍스트 삽입
 *
 * 시나리오:
 * 1. 빈 문서에서 도형 3개(선, 사각형, 타원) 생성
 * 2. 조판부호 보이기 활성화
 * 3. 커서 이동: 도형 사이를 좌/우 방향키로 이동
 * 4. 텍스트 삽입: 도형 사이에 스페이스 입력
 */

import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

const mode = process.argv.includes('--mode=headless') ? 'headless' : 'host';

async function run() {
  const browser = await launchBrowser(mode);
  const page = await createPage(browser, mode);

  try {
    await loadApp(page, mode);

    // 새 문서 생성
    await page.evaluate(() => {
      const btn = document.querySelector('[data-cmd="file:new-doc"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 커서 위치 확인 함수
    const getCursorPos = () => page.evaluate(() => {
      const ih = window.__inputHandler;
      if (!ih) return null;
      const pos = ih.getCursorPosition();
      return { sec: pos.sectionIndex, para: pos.paragraphIndex, offset: pos.charOffset };
    });

    // 초기 커서 위치
    const pos0 = await getCursorPos();
    console.log('초기 커서:', pos0);

    // WASM으로 직접 도형 3개 생성 (선, 사각형, 타원)
    for (const type of ['line', 'rectangle', 'ellipse']) {
      await page.evaluate((shapeType) => {
        const wasm = window.__wasm;
        if (!wasm) return;
        wasm.createShapeControl({
          sectionIdx: 0,
          paraIdx: 0,
          charOffset: 0,
          width: 5000,
          height: 3000,
          horzOffset: 1000,
          vertOffset: 1000,
          shapeType,
        });
      }, type);
    }

    // document-changed 이벤트 발생
    await page.evaluate(() => {
      window.__eventBus?.emit('document-changed');
    });
    await new Promise(r => setTimeout(r, 500));

    // 조판부호 보이기
    await page.evaluate(() => {
      const btn = document.querySelector('[data-cmd="view:show-ctrl-mark"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await screenshot(page, 'shape-inline-01-created.png');

    // 커서를 문단 시작으로 이동
    await page.evaluate(() => {
      const ih = window.__inputHandler;
      if (ih) ih.moveCursorTo({ sectionIndex: 0, paragraphIndex: 0, charOffset: 0 });
    });
    await new Promise(r => setTimeout(r, 300));

    const posStart = await getCursorPos();
    console.log('문단 시작 커서:', posStart);

    // 오른쪽 방향키로 이동
    const positions = [posStart];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('ArrowRight');
      await new Promise(r => setTimeout(r, 200));
      const p = await getCursorPos();
      positions.push(p);
      console.log(`ArrowRight ${i+1}:`, p);
    }

    await screenshot(page, 'shape-inline-02-navigation.png');

    // 스페이스 입력 테스트: 커서를 offset 0으로 이동 후 스페이스
    await page.evaluate(() => {
      const ih = window.__inputHandler;
      if (ih) ih.moveCursorTo({ sectionIndex: 0, paragraphIndex: 0, charOffset: 0 });
    });
    await new Promise(r => setTimeout(r, 300));

    await page.keyboard.type(' ');
    await new Promise(r => setTimeout(r, 500));

    const posAfterSpace = await getCursorPos();
    console.log('스페이스 입력 후:', posAfterSpace);

    await screenshot(page, 'shape-inline-03-space.png');

    console.log('\n=== 테스트 완료 ===');
  } catch (err) {
    console.error('테스트 실패:', err);
    await screenshot(page, 'shape-inline-error.png');
  } finally {
    await closeBrowser(browser, mode);
  }
}

run();
