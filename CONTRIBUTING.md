# Contributing to rhwp

rhwp에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 참여하기 위한 가이드입니다.

## Getting Started

### 개발 환경 설정

```bash
# 1. 리포지토리 클론
git clone https://github.com/pureink-studio/rhwp.git
cd rhwp

# 2. Rust 빌드 확인
cargo build
cargo test

# 3. WASM 빌드 (선택)
cp .env.docker.example .env.docker
docker compose --env-file .env.docker run --rm wasm

# 4. 웹 에디터 실행
cd rhwp-studio
npm install
npx vite --host 0.0.0.0 --port 7700
```

### 온보딩 가이드

프로젝트의 아키텍처, 디버깅 방법, 워크플로우에 대한 상세 가이드:
- [온보딩 가이드](mydocs/manual/onboarding_guide.md)

## Development Workflow

### 브랜치 규칙

| 브랜치 | 용도 |
|--------|------|
| `main` | 릴리즈 (안정 버전) |
| `devel` | 개발 통합 |
| `local/task{N}` | 타스크별 작업 |

### 타스크 진행 절차

1. **이슈 등록** — GitHub Issue 또는 `mydocs/orders/yyyymmdd.md`에 등록
2. **브랜치 생성** — `devel`에서 `local/task{N}` 브랜치 생성
3. **구현** — 코드 작성 + 테스트 추가
4. **테스트 통과** — `cargo test` 전체 통과 확인
5. **PR 생성** — `devel` 브랜치로 Pull Request
6. **코드 리뷰** — 리뷰 후 merge

### 커밋 메시지 규칙

```
{변경 요약} (Task {N})

- 변경 사항 1
- 변경 사항 2

Co-Authored-By: {name} <{email}>
```

예시:
```
TAC 표 다음 문단 vpos 간격 과대 수정 (Task 390)

- 마지막 TAC의 line_end 보정에 상한 추가: table_y_end + line_spacing
- synam-001.hwp p8: pi=82→pi=83 간격 정상화
```

## Debugging

### 디버깅 3종 도구

레이아웃/간격 버그 디버깅 시 코드 수정 없이 다음 순서로 진행합니다:

```bash
# 1. 문단/표 식별
rhwp export-svg sample.hwp --debug-overlay

# 2. 페이지 배치 확인
rhwp dump-pages sample.hwp -p 15

# 3. 특정 문단 상세 조사
rhwp dump sample.hwp -s 2 -p 45
```

#### 디버그 오버레이 라벨 형식

- 문단: `s{섹션}:pi={인덱스} y={좌표}`
- 표: `s{섹션}:pi={인덱스} ci={컨트롤} {행}x{열} y={좌표}`

작업지시자와 개발자가 **동일한 인덱스로 문단을 지정**할 수 있어 커뮤니케이션이 정확합니다.

### HWP 단위

- 1 inch = 7,200 HWPUNIT
- 1 mm ≈ 283.465 HWPUNIT

## Code Style

### Rust

- `cargo clippy` 경고 0건 유지
- `unwrap()` 사용 최소화 (equation parser 등 안전한 컨텍스트 제외)
- 모듈 구조: `model/` → `parser/` → `document_core/` → `renderer/` 의존성 방향 유지

### TypeScript (rhwp-studio)

- Vite + TypeScript (strict mode)
- CSS 접두어 규칙: `tb-` (도구상자), `sb-` (서식바), `md-` (메뉴), `dialog-` (대화상자)

## Architecture

```
┌─────────────┐
│   model/    │  ← 순수 데이터 구조 (외부 의존 없음)
├─────────────┤
│   parser/   │  ← HWP/HWPX → model 변환
├─────────────┤
│ document_   │  ← 편집 명령(Commands) + 조회(Queries)
│    core/    │     CQRS 패턴
├─────────────┤
│  renderer/  │  ← 렌더링 엔진 (layout, pagination, SVG/Canvas)
├─────────────┤
│  wasm_api   │  ← WASM 바인딩 (thin wrapper)
├─────────────┤
│ rhwp-studio │  ← 웹 에디터 (TypeScript + Canvas)
└─────────────┘
```

### 의존성 규칙

- `model` → 외부 의존 없음
- `parser` → `model` 참조만
- `document_core` → `model` + `parser`(로드 시만)
- `renderer` → `model` + `document_core`(queries)
- `wasm_api` → 전체 (thin wrapper)

## Testing

### 테스트 구성

| 유형 | 위치 | 수량 |
|------|------|------|
| 단위 테스트 | `src/*/tests.rs` | 755+ |
| 통합 테스트 | `src/renderer/layout/integration_tests.rs` | 11 |
| E2E 테스트 | `rhwp-studio/e2e/` | 12 시나리오 |

### 테스트 실행

```bash
cargo test                           # 전체 테스트
cargo test test_equation             # 특정 테스트
cargo test -- --nocapture            # 출력 포함

# E2E 테스트
cd rhwp-studio
node e2e/text-flow.test.mjs --mode=headless
```

### 코드 품질 대시보드

```bash
./scripts/metrics.sh                 # 메트릭 수집 + 대시보드 생성
# → output/dashboard.html
```

## HWP Spec Notes

- HWP 5.0 스펙 문서에 **알려진 오류**가 있습니다 — [hwp_spec_errata.md](mydocs/tech/hwp_spec_errata.md) 참조
- 새 바이너리 구조 구현 시 **반드시 실제 바이너리 데이터와 교차 검증**하세요
- 자체 정리 문서: [표 렌더링 가이드](mydocs/tech/hwp_table_rendering.md), [수식 지원 현황](mydocs/tech/equation_support_status.md)

## License

이 프로젝트는 [MIT License](LICENSE)로 배포됩니다.
