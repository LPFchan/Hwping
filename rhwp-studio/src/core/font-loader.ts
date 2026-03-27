/**
 * 웹폰트 로더 — web/editor.html의 폰트 로딩 시스템을 TypeScript로 포팅
 *
 * 2계층 로딩:
 *   1. CSS @font-face 규칙 생성 (Canvas 2D 호환)
 *   2. FontFace API로 즉시 로드 + document.fonts.add()
 */

interface FontEntry {
  name: string;
  file: string;
}

// 한컴 webhwp CSS(@font-face) 매핑 기준 + HWP 문서에서 사용하는 별칭
const FONT_LIST: FontEntry[] = [
  // === 한컴 HY 폰트 ===
  { name: 'HY헤드라인M', file: 'fonts/h2hdrm.woff2' },
  { name: 'HYHeadLine M', file: 'fonts/h2hdrm.woff2' },
  { name: 'HYHeadLine Medium', file: 'fonts/h2hdrm.woff2' },
  { name: 'HY견고딕', file: 'fonts/hygtre.woff2' },
  { name: 'HYGothic-Extra', file: 'fonts/hygtre.woff2' },
  { name: 'HY그래픽', file: 'fonts/hygprm.woff2' },
  { name: 'HYGraphic-Medium', file: 'fonts/hygprm.woff2' },
  { name: 'HY그래픽M', file: 'fonts/hygprm.woff2' },
  { name: 'HY견명조', file: 'fonts/hymjre.woff2' },
  { name: 'HYMyeongJo-Extra', file: 'fonts/hymjre.woff2' },
  // HY 중간 치환 폰트 (woff2 미보유 → 완전한 한글 폰트로 매핑)
  { name: 'HY신명조', file: 'fonts/hamchob-r.woff2' },
  { name: 'HY중고딕', file: 'fonts/hamchod-r.woff2' },
  { name: '양재튼튼체B', file: 'fonts/hamchod-r.woff2' },
  { name: 'Palatino Linotype', file: 'fonts/TimesNewRomanW05-Regular.woff2' },
  // === 함초롬/함초롱/한컴 폰트 ===
  { name: '함초롬돋움', file: 'fonts/hamchod-r.woff2' },
  { name: '함초롬바탕', file: 'fonts/hamchob-r.woff2' },
  { name: '함초롱돋움', file: 'fonts/hamchod-r.woff2' },
  { name: '함초롱바탕', file: 'fonts/hamchob-r.woff2' },
  { name: '한컴돋움', file: 'fonts/hamchod-r.woff2' },
  { name: '한컴바탕', file: 'fonts/hamchob-r.woff2' },
  { name: '새돋움', file: 'fonts/hamchod-r.woff2' },
  { name: '새바탕', file: 'fonts/hamchob-r.woff2' },
  // === 한글 시스템 폰트 ===
  { name: 'Malgun Gothic', file: 'fonts/MalgunGothicW35-Regular.woff2' },
  { name: '맑은 고딕', file: 'fonts/MalgunGothicW35-Regular.woff2' },
  { name: '돋움', file: 'fonts/hamchod-r.woff2' },
  { name: '돋움체', file: 'fonts/hamchod-r.woff2' },
  { name: '굴림', file: 'fonts/hamchod-r.woff2' },
  { name: '굴림체', file: 'fonts/hamchod-r.woff2' },
  { name: '새굴림', file: 'fonts/hamchod-r.woff2' },
  { name: '바탕', file: 'fonts/hamchob-r.woff2' },
  { name: '바탕체', file: 'fonts/hamchob-r.woff2' },
  { name: '궁서', file: 'fonts/hamchob-r.woff2' },
  { name: '궁서체', file: 'fonts/hamchob-r.woff2' },
  { name: '새궁서', file: 'fonts/hamchob-r.woff2' },
  // === 영문 폰트 ===
  { name: 'Arial', file: 'fonts/ArialW05-Regular.woff2' },
  { name: 'Times New Roman', file: 'fonts/TimesNewRomanW05-Regular.woff2' },
  { name: 'Calibri', file: 'fonts/Calibri.woff2' },
  { name: 'Courier New', file: 'fonts/CourierNewW05-Regular.woff2' },
  { name: 'Tahoma', file: 'fonts/TahomaW05-Regular.woff2' },
  { name: 'Verdana', file: 'fonts/VerdanaW05-Regular.woff2' },
  { name: 'Webdings', file: 'fonts/WebdingsW95-Regular.woff2' },
  { name: 'Wingdings 3', file: 'fonts/WingdingsW95-3.woff2' },
  // === Pretendard ===
  { name: 'Pretendard', file: 'fonts/Pretendard-Regular.woff2' },
  { name: 'Pretendard Thin', file: 'fonts/Pretendard-Thin.woff2' },
  { name: 'Pretendard ExtraLight', file: 'fonts/Pretendard-ExtraLight.woff2' },
  { name: 'Pretendard Light', file: 'fonts/Pretendard-Light.woff2' },
  { name: 'Pretendard Medium', file: 'fonts/Pretendard-Medium.woff2' },
  { name: 'Pretendard SemiBold', file: 'fonts/Pretendard-SemiBold.woff2' },
  { name: 'Pretendard Bold', file: 'fonts/Pretendard-Bold.woff2' },
  { name: 'Pretendard ExtraBold', file: 'fonts/Pretendard-ExtraBold.woff2' },
  { name: 'Pretendard Black', file: 'fonts/Pretendard-Black.woff2' },
  // === Happiness Sans ===
  { name: '해피니스 산스 레귤러', file: 'fonts/Happiness-Sans-Regular.woff2' },
  { name: 'Happiness Sans Regular', file: 'fonts/Happiness-Sans-Regular.woff2' },
  { name: '해피니스 산스 볼드', file: 'fonts/Happiness-Sans-Bold.woff2' },
  { name: 'Happiness Sans Bold', file: 'fonts/Happiness-Sans-Bold.woff2' },
  { name: '해피니스 산스 타이틀', file: 'fonts/Happiness-Sans-Title.woff2' },
  { name: 'Happiness Sans Title', file: 'fonts/Happiness-Sans-Title.woff2' },
  { name: '해피니스 산스 VF', file: 'fonts/HappinessSansVF.woff2' },
  { name: 'Happiness Sans VF', file: 'fonts/HappinessSansVF.woff2' },
  // === Cafe24 ===
  { name: 'Cafe24 Ssurround Bold', file: 'fonts/Cafe24Ssurround-v2.0.woff2' },
  { name: '카페24 슈퍼매직', file: 'fonts/Cafe24Supermagic-Regular-v1.0.woff2' },
  { name: 'Cafe24 Supermagic', file: 'fonts/Cafe24Supermagic-Regular-v1.0.woff2' },
  // === 기타 ===
  { name: 'SpoqaHanSans', file: 'fonts/SpoqaHanSans-Regular.woff2' },
];

/** @font-face에 등록된 폰트 이름 Set */
export const REGISTERED_FONTS = new Set(FONT_LIST.map(f => f.name));

/** 초기 렌더링에 필수인 폰트 (대부분의 HWP 문서 기본 서체) */
const CRITICAL_FONTS = new Set(['함초롬바탕', '함초롬돋움']);

/** CSS @font-face 등록 여부 (중복 등록 방지) */
let fontFaceRegistered = false;

/** 이미 로드 완료된 woff2 파일 (중복 네트워크 요청 방지) */
const loadedFiles = new Set<string>();

/**
 * 웹폰트를 선별 로드한다.
 *   1단계(동기): CSS @font-face 전체 등록 (최초 1회, 네트워크 미발생)
 *   2단계: 대상 폰트 로드 (이미 로드된 파일은 건너뜀)
 *
 * @param docFonts 문서에서 사용하는 폰트 이름 목록 (있으면 해당 폰트 + CRITICAL만 로드, 없으면 전체)
 * @param onProgress 폰트 로드 진행률 콜백 (loaded, total)
 */
export async function loadWebFonts(
  docFonts?: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  // 1) CSS @font-face 규칙 전체 등록 (네트워크 미발생, 최초 1회만)
  if (!fontFaceRegistered) {
    const style = document.createElement('style');
    style.textContent = FONT_LIST.map(f =>
      `@font-face { font-family: "${f.name}"; src: url("${f.file}") format("woff2"); font-display: swap; }`
    ).join('\n');
    document.head.appendChild(style);
    fontFaceRegistered = true;
  }

  // 2) 로드 대상 결정: docFonts에 포함된 폰트 + CRITICAL만 로드
  const targetSet = new Set([...(docFonts ?? []), ...CRITICAL_FONTS]);
  const toLoad = FONT_LIST.filter(f => targetSet.has(f.name));

  // woff2 파일 기준으로 중복 제거 + 이미 로드된 파일 건너뜀
  const seenFiles = new Set<string>();
  const uniqueToLoad: FontEntry[] = [];
  for (const f of toLoad) {
    if (!seenFiles.has(f.file) && !loadedFiles.has(f.file)) {
      seenFiles.add(f.file);
      uniqueToLoad.push(f);
    }
  }

  if (uniqueToLoad.length === 0) return;

  const total = uniqueToLoad.length;
  console.log(`[FontLoader] 웹폰트 로드 시작: ${total}개 woff2 (이미 로드됨: ${loadedFiles.size}개)`);

  // 같은 woff2 파일에 매핑된 모든 이름도 함께 등록
  const fileToNames = new Map<string, string[]>();
  for (const f of toLoad) {
    if (!loadedFiles.has(f.file)) {
      const names = fileToNames.get(f.file) ?? [];
      names.push(f.name);
      fileToNames.set(f.file, names);
    }
  }

  let loaded = 0;
  let failed = 0;
  const BATCH = 4;

  for (let i = 0; i < uniqueToLoad.length; i += BATCH) {
    const batch = uniqueToLoad.slice(i, i + BATCH);
    await Promise.all(batch.map(async (f) => {
      try {
        const names = fileToNames.get(f.file) ?? [f.name];
        for (const name of names) {
          const face = new FontFace(name, `url(${f.file}) format('woff2')`);
          const result = await face.load();
          document.fonts.add(result);
        }
        loadedFiles.add(f.file);
        loaded++;
      } catch {
        failed++;
      }
      onProgress?.(loaded + failed, total);
    }));
    if (i + BATCH < uniqueToLoad.length) {
      await new Promise(r => setTimeout(r, 0));
    }
  }

  console.log(`[FontLoader] 폰트 로드 완료: ${loaded}개 성공, ${failed}개 실패 (총 ${loadedFiles.size}개 woff2 로드됨)`);
}
