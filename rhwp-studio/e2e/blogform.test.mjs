/**
 * E2E 테스트 — BlogForm_BookReview.hwp 누름틀 안내문 처리 (Task 274)
 */
import { launchBrowser, closeBrowser, createPage, loadApp, screenshot, assert } from './helpers.mjs';

async function run() {
  console.log('=== E2E: BlogForm_BookReview.hwp 누름틀 안내문 테스트 ===\n');

  const browser = await launchBrowser();
  const page = await createPage(browser, 900, 800);

  try {
    console.log('[1] 앱 로드...');
    await loadApp(page);
    await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

    // 콘솔 출력 캡처 (WASM eprintln → console.error)
    page.on('console', msg => {
      const t = msg.text();
      if (t.includes('FIELD') || t.includes('BUILD') || t.includes('active')) {
        console.log(`  [console.${msg.type()}]`, t);
      }
    });

    console.log('[2] BlogForm_BookReview.hwp 파일 로드...');
    const loadResult = await page.evaluate(async () => {
      try {
        const resp = await fetch('/samples/BlogForm_BookReview.hwp');
        if (!resp.ok) return { error: `HTTP ${resp.status}` };
        const buf = await resp.arrayBuffer();
        const data = new Uint8Array(buf);
        const docInfo = window.__wasm?.loadDocument(data, 'BlogForm_BookReview.hwp');
        if (!docInfo) return { error: 'loadDocument returned null' };
        const cv = window.__canvasView;
        if (cv?.loadDocument) cv.loadDocument();
        return { pageCount: docInfo.pageCount };
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
    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    await screenshot(page, 'blogform-01-before-click');

    // "제목" 오른쪽 셀(안내문 영역)을 클릭
    console.log('[3] 누름틀 셀 클릭...');
    // 캔버스에서 "이곳에 책 제목을 입력하세요" 위치를 클릭
    const canvas = await page.$('canvas');
    const box = await canvas.boundingBox();
    // 첫 번째 표 > 중첩 표 > "제목" 행 오른쪽 셀 안내문 클릭
    await page.mouse.click(box.x + 530, box.y + 155);
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    await screenshot(page, 'blogform-02-after-click');

    // 필드 정보 확인
    const fieldInfo = await page.evaluate(() => {
      const ih = window.__inputHandler;
      if (!ih) return { error: 'no inputHandler' };
      // 수동으로 setActiveField 호출 테스트
      const wasm = window.__wasm;
      const cursor = ih._cursor || ih.cursor;
      const pos = cursor?.getPosition?.();
      const fi = ih.getFieldInfo?.();
      return {
        ...(fi || {}),
        inField: ih.isInField?.() ?? false,
        pos: pos ? { sec: pos.sectionIndex, para: pos.paragraphIndex, char: pos.charOffset,
                     parentPara: pos.parentParaIndex, ctrlIdx: pos.controlIndex,
                     cellIdx: pos.cellIndex, cellPara: pos.cellParaIndex } : null,
      };
    });
    console.log('  필드 정보:', JSON.stringify(fieldInfo));

    // clearActiveField → setActiveFieldInCell → document-changed emit
    const setResult = await page.evaluate(() => {
      const wasm = window.__wasm;
      if (!wasm || !wasm.doc) return { error: 'no wasm.doc' };
      try {
        wasm.doc.clearActiveField();
        const r = wasm.doc.setActiveFieldInCell(0, 1, 0, 1, 0, 13, false);
        // document-changed 이벤트 emit으로 refreshPages 트리거
        const cv = window.__canvasView;
        if (cv?.refreshPages) cv.refreshPages();
        return { changed: r };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log('  setActiveField 결과:', JSON.stringify(setResult));

    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    await screenshot(page, 'blogform-03-after-setActive');

    // 필드 디버그: properties, guide_text 등
    const fieldDebug = await page.evaluate(() => {
      const wasm = window.__wasm;
      if (!wasm?.doc) return { error: 'no doc' };
      try {
        // debug_field_at API가 있으면 사용
        const result = wasm.doc.debugFieldAt?.(0, 1, 0, 1, 0, 13);
        return result ? JSON.parse(result) : { noDebugApi: true };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log('  필드 디버그:', JSON.stringify(fieldDebug));

    // 상태 표시줄 확인
    const statusText = await page.evaluate(() => {
      const el = document.getElementById('status-bar');
      return el ? el.textContent : '';
    });
    console.log('  상태 표시줄:', statusText);

  } finally {
    await closeBrowser(browser);
  }

  console.log('\n=== 완료 ===');
}

run().catch(e => { console.error(e); process.exit(1); });
