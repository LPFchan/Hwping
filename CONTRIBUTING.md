# Contributing to Hwping

Hwping에 관심을 가져주셔서 감사합니다.

Hwping은 `rhwp`를 upstream으로 추적하는 macOS 중심 downstream fork입니다. 이 저장소의 기여 기준은 단순합니다. Hwping에 직접 필요한 것만 남기고, upstream sync 비용을 키우는 표면은 줄입니다.

## 시작하기

```bash
git clone https://github.com/LPFchan/Hwping.git
cd Hwping

# upstream remote가 없다면 추가
git remote add upstream https://github.com/edwardkim/rhwp.git

cargo build
cargo test
cargo clippy -- -D warnings
```

## 기여 원칙

- `crates/rhwp/src/` 변경은 먼저 upstreamable인지 판단합니다.
- Hwping 전용 코드는 downstream 계층에 두고 엔진 core에 섞지 않습니다.
- AppKit, SwiftUI, Quick Look, Finder 연동 코드는 엔진 내부에 넣지 않습니다.
- 웹 데모, npm 배포, VS Code 확장 같은 제거된 표면을 Hwping 기본 트리에 다시 추가하지 않습니다.
- 새로 추가하거나 전면 개정하는 저장소 문서는 영어를 기준 문서로 작성합니다.

## 변경 분류

### 1. Upstreamable

- 파서 정확도 개선
- 렌더러 정확도 개선
- 직렬화 품질 개선
- 플랫폼 비의존 성능 개선

이 범주의 변경은 가능한 한 작고 독립적으로 유지합니다.

### 2. Local Compatibility

- Hwping 통합에 당장 필요하지만 아직 일반화되지 않은 변경
- facade 계층으로 옮겨갈 여지가 있는 임시 패치

이 범주의 변경은 범위를 좁게 유지하고, 왜 임시인지 문서화합니다.

### 3. Product-Only

- macOS 앱 UX
- Quick Look 확장
- Finder 연동
- FFI 경계

이 범주의 변경은 upstream-aligned engine 영역에 넣지 않습니다.

## 작업 흐름

1. 이슈를 등록하고 범위를 명확히 합니다.
2. `local/task{issue번호}` 브랜치를 만듭니다.
3. 계획서를 작성하고 승인받은 뒤 구현합니다.
4. 구현 후 `cargo test`, `cargo clippy -- -D warnings`로 검증합니다.
5. `devel` 대상으로 PR을 생성합니다.

## PR 전 체크리스트

```bash
cargo build
cargo test
cargo clippy -- -D warnings
```

- 변경이 engine인지 product인지 분류가 되어 있어야 합니다.
- 엔진 public surface를 넓혔다면 이유가 설명되어 있어야 합니다.
- Hwping과 무관한 product surface를 되살리는 변경은 피합니다.

## 디버깅 가이드

렌더링 문제를 조사할 때는 먼저 CLI 도구를 사용합니다.

```bash
# 1. 문단/표 식별
cargo run --bin rhwp -- export-svg sample.hwp --debug-overlay

# 2. 페이지 배치 목록
cargo run --bin rhwp -- dump-pages sample.hwp -p 3

# 3. 특정 문단 상세
cargo run --bin rhwp -- dump sample.hwp -s 0 -p 45
```

디버그 오버레이 라벨:

- 문단: `s{섹션}:pi={인덱스} y={좌표}`
- 표: `s{섹션}:pi={인덱스} ci={컨트롤} {행}x{열} y={좌표}`

## 프로젝트 구조

```
crates/rhwp/src/
├── model/          ← 순수 데이터 구조
├── parser/         ← HWP/HWPX 파일 → 모델 변환
├── document_core/  ← 편집 명령 + 조회
├── renderer/       ← 레이아웃, 페이지네이션, SVG/PDF 출력
├── serializer/     ← 모델 → HWP 파일 저장
└── wasm_api.rs     ← 엔진 바인딩 레이어

crates/hwping-core/ ← app-facing facade 경계
crates/hwping-ffi/  ← Swift FFI 경계
apps/               ← macOS 앱 타깃
extensions/         ← Quick Look 확장 타깃

samples/            ← 회귀 검증용 문서 샘플
mydocs/             ← 계획, 보고, 기술 문서
scripts/            ← 품질/동기화 보조 스크립트
```

의존성 방향: `model` ← `parser` ← `document_core` ← `renderer` ← `wasm_api`

## HWP 단위 참고

- 1 inch = 7,200 HWPUNIT
- 1 mm ≈ 283.465 HWPUNIT

## Notice

본 제품은 한글과컴퓨터의 한글 문서 파일(.hwp) 공개 문서를 참고하여 개발하였습니다.

## License

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다. 기여하신 코드도 동일한 라이선스가 적용됩니다.
