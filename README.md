<p align="center">
  <img src="assets/logo/logo-256.png" alt="Hwping logo" width="128" />
</p>

<h1 align="center">Hwping</h1>

<p align="center">
  <strong>macOS 중심 HWP 제품을 위한 downstream fork</strong><br/>
  <em>upstream `rhwp` 엔진을 추적하면서 Hwping에 필요한 코드만 유지합니다.</em>
</p>

<p align="center">
  <strong>한국어</strong> | <a href="README_EN.md">English</a>
</p>

---

Hwping은 `rhwp`를 upstream으로 추적하는 macOS 중심 downstream fork입니다.

이 저장소의 목표는 두 가지입니다.

- HWP/HWPX 엔진을 upstream과 계속 sync 가능한 상태로 유지하기
- Hwping 제품에 직접 필요하지 않은 web, npm, VS Code 표면을 가지치기해서 포크를 가볍게 유지하기

현재 이 저장소는 웹 데모, npm 패키지 배포, VS Code 확장을 기본 제공 대상으로 보지 않습니다. 이 포크는 엔진, CLI, 샘플, 회귀 검증 도구, 그리고 Hwping용 구조 정리에 집중합니다.

자세한 방향은 [mydocs/hwping/plans/hwping_repo_sync_plan.md](mydocs/hwping/plans/hwping_repo_sync_plan.md)를 참조하세요.

## 현재 범위

- HWP 5.0 / HWPX 파서
- 문단, 표, 수식, 이미지, 차트 렌더링
- 페이지네이션, 머리말/꼬리말, 바탕쪽, 각주 처리
- HWP 저장기와 PDF/SVG 출력 경로
- CLI 기반 디버깅 도구와 회귀 검증 샘플

## 빠른 시작

### 요구 사항

- Rust 1.75+

### 빌드

```bash
cargo build
cargo test
cargo clippy -- -D warnings
```

### 주요 CLI 사용 예시

```bash
# SVG 내보내기
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp

# 디버그 오버레이 포함 SVG
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp --debug-overlay

# 페이지 배치 목록 확인
cargo run --bin rhwp -- dump-pages samples/biz_plan.hwp -p 0

# 특정 문단 상세 확인
cargo run --bin rhwp -- dump samples/biz_plan.hwp -s 0 -p 45
```

## 디버깅 워크플로우

레이아웃 불일치나 간격 문제를 볼 때는 먼저 코드 수정 없이 아래 순서로 확인합니다.

1. `export-svg --debug-overlay`로 문단과 표를 식별합니다.
2. `dump-pages -p N`으로 해당 페이지의 배치 목록과 높이를 확인합니다.
3. `dump -s N -p M`으로 ParaShape, LINE_SEG, 표 속성을 조사합니다.

## 프로젝트 구조

```text
crates/rhwp/src/
  parser/            HWP/HWPX 파서
  model/             문서 모델
  document_core/     편집 명령 + 조회
  renderer/          레이아웃, 페이지네이션, SVG/PDF 출력
  serializer/        HWP 저장
  wasm_api.rs        엔진 바인딩 레이어

crates/hwping-core/  app-facing facade 경계
crates/hwping-ffi/   Swift-facing FFI 경계
apps/hwping-macos/   macOS 앱 타깃 자리 표시자
extensions/          Quick Look 확장 타깃 자리 표시자

samples/             회귀 검증용 문서 샘플
mydocs/              계획, 보고, 기술 문서
scripts/             품질/동기화 보조 스크립트
```

이제 루트는 Cargo workspace이며, upstream-aligned engine 크레이트 `rhwp`는 `crates/rhwp` 아래에 있습니다. 이름 자체는 upstream과의 기술적 연속성을 위해 유지합니다.

## 기여 원칙

- engine 변경은 먼저 upstreamable인지 판단합니다.
- Hwping 전용 product 코드는 downstream 계층으로 분리합니다.
- AppKit, SwiftUI, Quick Look, Finder 연동은 engine core에 섞지 않습니다.
- upstream에 이미 존재하는 web, npm, VS Code 표면은 이 포크에서 기본적으로 보존 대상이 아닙니다.

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 문서

`mydocs/`에는 계획서, 단계별 보고서, 기술 조사 문서, 트러블슈팅 기록이 있습니다. Hwping 구조 정리와 upstream sync 전략 문서는 `mydocs/hwping/` 아래에 정리합니다.

## Notice

본 제품은 한글과컴퓨터의 한글 문서 파일(.hwp) 공개 문서를 참고하여 개발하였습니다.

## License

[MIT License](LICENSE)
