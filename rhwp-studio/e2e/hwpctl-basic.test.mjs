/**
 * hwpctl 호환 레이어 E2E 테스트 — 기본 동작
 *
 * 실행:
 *   node e2e/hwpctl-basic.test.mjs
 *   node e2e/hwpctl-basic.test.mjs --mode=headless
 */
import { launchBrowser, closeBrowser, createPage, screenshot, assert } from './helpers.mjs';

const VITE_URL = process.env.VITE_URL || 'http://localhost:7700';

async function test() {
  console.log('=== hwpctl 호환 레이어 E2E 테스트 ===\n');
  const browser = await launchBrowser();
  const page = await createPage(browser);

  try {
    // hwpctl 테스트 페이지 로드
    console.log('  [1] 테스트 페이지 로드...');
    await page.goto(`${VITE_URL}/hwpctl-test.html`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // WASM 초기화 대기

    // HwpCtrl 객체 존재 확인
    console.log('  [2] HwpCtrl 초기화 확인...');
    const hasHwpCtrl = await page.evaluate(() => !!window.HwpCtrl);
    assert(hasHwpCtrl, 'HwpCtrl 객체가 전역에 존재해야 함');

    // Action 등록 확인
    console.log('  [3] Action 등록 확인...');
    const actionCount = await page.evaluate(() =>
      window.HwpCtrl.constructor.getRegisteredActionCount()
    );
    assert(actionCount >= 30, `등록 Action 30개 이상 (실제: ${actionCount})`);
    console.log(`     등록 Action: ${actionCount}개`);

    // CreateAction 동작 확인
    console.log('  [4] CreateAction 동작 확인...');
    const actId = await page.evaluate(() => {
      const act = window.HwpCtrl.CreateAction("TableCreate");
      return act.ActID;
    });
    assert(actId === 'TableCreate', `ActID = "TableCreate" (실제: "${actId}")`);

    // ParameterSet 동작 확인
    console.log('  [5] ParameterSet 동작 확인...');
    const setResult = await page.evaluate(() => {
      const set = window.HwpCtrl.CreateSet("TableCreation");
      set.SetItem("Rows", 10);
      set.SetItem("Cols", 6);
      return { rows: set.GetItem("Rows"), cols: set.GetItem("Cols"), name: set.name };
    });
    assert(setResult.rows === 10, `Rows = 10 (실제: ${setResult.rows})`);
    assert(setResult.cols === 6, `Cols = 6 (실제: ${setResult.cols})`);
    assert(setResult.name === 'TableCreation', `Set name = "TableCreation"`);

    // InsertText 동작 확인
    console.log('  [6] InsertText 동작 확인...');
    const textResult = await page.evaluate(() => {
      window.HwpCtrl.Clear();
      const ok = window.HwpCtrl.InsertText("테스트 문장");
      const pos = window.HwpCtrl.GetPos();
      return { ok, pos };
    });
    assert(textResult.ok === true, 'InsertText 성공');
    assert(textResult.pos.pos > 0, `커서 이동 (pos=${textResult.pos.pos})`);

    // 구현률 확인
    console.log('  [7] 구현률 확인...');
    const implRate = await page.evaluate(() => {
      const total = window.HwpCtrl.constructor.getRegisteredActionCount();
      const impl = window.HwpCtrl.constructor.getImplementedActionCount();
      return { total, impl, rate: Math.round(impl / total * 100) };
    });
    console.log(`     구현률: ${implRate.impl}/${implRate.total} (${implRate.rate}%)`);

    await screenshot(page, 'hwpctl-basic');
    console.log('\n✅ 모든 테스트 통과!\n');

  } catch (e) {
    await screenshot(page, 'hwpctl-basic-fail');
    console.error('\n❌ 테스트 실패:', e.message, '\n');
    process.exitCode = 1;
  } finally {
    await closeBrowser(browser);
  }
}

test();
