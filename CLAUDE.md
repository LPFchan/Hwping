# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**목표**: Hwping용 HWP 엔진과 downstream 제품 계층 유지
- upstream `rhwp`와 sync 가능한 Rust 기반 HWP/HWPX 파서 및 렌더러 유지
- Hwping에 필요한 macOS 제품 계층을 downstream으로 분리
- Hwping에 직접 필요하지 않은 web, npm, VS Code 표면은 기본 트리에서 제거

## 문서 생성 규칙

모든 문서는 한국어로 작성한다.

문서 폴더 구조 (`mydocs/` 하위):
- `orders/` - 오늘 할일 문서 (yyyymmdd.md)
- `plans/` - 수행 계획서, 구현 계획서 (task_{milestone}_{number}.md)
- `plans/archives/` - 완료된 계획서 보관
- `working/` - 단계별 완료 보고서
- `report/` - 기본 보고서
- `feedback/` - 피드백 저장
- `tech/` - 기술 사항 정리 문서
- `manual/` - 매뉴얼, 가이드 문서
- `troubleshootings/` - 트러블슈팅 관련 문서

## 빌드 및 실행

### 로컬 빌드

```bash
cargo build                    # 네이티브 빌드
cargo test                     # 테스트 실행
cargo build --release          # 릴리즈 빌드
```

네이티브 빌드·테스트·SVG 내보내기는 **항상 로컬 cargo**를 사용한다.

### SVG 내보내기

```bash
rhwp export-svg sample.hwp                         # output/ 폴더에 SVG 출력
rhwp export-svg sample.hwp -o my_dir/              # 지정 폴더에 출력
rhwp export-svg sample.hwp -p 0                    # 특정 페이지만 출력 (0부터)
rhwp export-svg sample.hwp --show-para-marks       # 문단부호(↵/↓) 표시
rhwp export-svg sample.hwp --show-control-codes    # 조판부호 표시 (문단부호+개체마커)
rhwp export-svg sample.hwp --debug-overlay         # 디버그 오버레이 (문단/표 경계+인덱스)
```

#### 디버그 오버레이 (`--debug-overlay`)

문단/표의 경계와 인덱스를 SVG에 시각적으로 표시한다.

- **문단**: 색상 교대 점선 경계 + `s{섹션}:pi={인덱스} y={좌표}` 라벨 (좌측 상단)
- **표**: 빨간 점선 경계 + `s{섹션}:pi={인덱스} ci={컨트롤} {행}x{열} y={좌표}` 라벨 (우측 상단)
- 셀 내부 문단, 머리말/꼬리말/바탕쪽/각주 영역은 제외

#### 페이지네이션 결과 덤프 (`dump-pages`)

특정 페이지의 문단/표 배치 목록과 높이를 확인한다.

```bash
rhwp dump-pages sample.hwp -p 15    # 페이지 16 (0부터) 배치 결과
```

출력 예시:
```
=== 페이지 16 (global_idx=15, section=2, page_num=6) ===
  body_area: x=96.0 y=103.6 w=601.7 h=930.5
  단 0 (items=7)
    FullParagraph  pi=41  h=37.3 (sb=16.0 lines=21.3 sa=0.0)  "자료형 설명"
    Table          pi=45 ci=0  16x4  492.2x278.7px  wrap=TopAndBottom tac=false
```

### IR 덤프 (`dump`)

문서의 조판부호 구조를 덤프한다. 섹션/문단 필터를 지정하여 특정 문단의 ParaShape, LINE_SEG, 표 속성을 확인할 수 있다.

```bash
rhwp dump sample.hwp                  # 전체 구조 덤프
rhwp dump sample.hwp -s 2 -p 45      # 섹션 2, 문단 45만 덤프
```

출력 예시:
```
--- 문단 2.45 --- cc=9, text_len=0, controls=1
  [PS] ps_id=32 align=Justify spacing: before=1000 after=0 line=160/Percent
       margins: left=7000 right=4000 indent=0 border_fill_id=1
  ls[0]: vpos=15360, lh=1000, th=1000, bl=850, ls=600, cs=3500, sw=0
  [0] 표: 16행×4열
  [0]   [common] treat_as_char=false, wrap=위아래, vert=문단(0=0.0mm)
  [0]   [outer_margin] left=1.0mm top=2.0mm right=1.0mm bottom=7.0mm
```

### IR 비교 (`ir-diff`)

동일 문서의 HWPX와 HWP 파일을 파싱하여 IR 차이를 자동 검출한다.

```bash
rhwp ir-diff sample.hwpx sample.hwp                    # 전체 비교
rhwp ir-diff sample.hwpx sample.hwp -s 0 -p 810        # 특정 문단만 비교
rhwp ir-diff sample.hwpx sample.hwp 2>&1 | grep "\[PS " # ParaShape 차이만
rhwp ir-diff sample.hwpx sample.hwp 2>&1 | tail -1      # 차이 건수만
```

비교 항목: text, char_count, char_offsets, char_shapes, line_segs, controls, tab_extended, ParaShape(여백/줄간격/탭), TabDef(위치/종류/채움).

상세 매뉴얼: `mydocs/manual/ir_diff_command.md`

### 디버깅 워크플로우

레이아웃/간격 버그 디버깅 시 다음 순서로 진행한다:

1. `export-svg --debug-overlay` → SVG에서 문단/표 식별 (`s{섹션}:pi={인덱스} y={좌표}`)
2. `dump-pages -p N` → 해당 페이지의 문단 배치 목록과 높이 확인
3. `dump -s N -p M` → 특정 문단의 ParaShape, LINE_SEG, 표 속성 상세 조사

HWPX↔HWP 불일치 디버깅 시 추가 단계:

4. `ir-diff sample.hwpx sample.hwp` → IR 차이 자동 검출
5. HWPX XML 원본 확인 (header.xml / section0.xml)

코드 수정 없이 전 과정 수행 가능하다.

### HWPUNIT

- 1인치 = 7200 HWPUNIT
- 1인치 = 25.4 mm

### 예제 폴더

- `samples/` - 테스트용 HWP 파일

### 출력 폴더

- `output/` - 렌더링 결과물 (SVG, HTML 등) 기본 출력 폴더
- `.gitignore`에 등록되어 있으므로 Git에 포함되지 않음

## 제품 경계 규칙

- 엔진 core 변경은 먼저 upstreamable인지 판단한다.
- macOS 앱, Quick Look, Finder 연동 같은 Hwping 전용 기능은 downstream 계층에 둔다.
- web 데모, npm 배포, VS Code 확장 같은 제거된 표면을 기본 트리에 다시 추가하지 않는다.
- upstream에 이미 존재하는 표면의 이력은 upstream이 보존하므로, 이 포크에서는 sync 비용을 줄이는 쪽을 우선한다.

## 워크플로우

### 브랜치 관리

| 브랜치 | 용도 |
|--------|------|
| `main` | 최종 릴리즈. 태그(v0.5.0 등)로 안정 버전 보존 |
| `devel` | 개발 통합 |
| `local/devel` | devel 브랜치의 로컬 작업 브랜치. 작업 완료 후 devel에 merge |
| `local/task{num}` | 타스크별 작업 |

### Git 워크플로우

```
local/task{N}  ──커밋──커밋──┐
local/task{N+1}──커밋──커밋──┤
                              ├─→ local/devel merge (작업 단위)
                              │
                              ├─→ devel merge (local/devel → devel)
                              │
                              ├─→ main merge + 태그 (릴리즈 시점)
```

- **타스크 브랜치**: `local/task{N}`에서 잘게 커밋. 작업 단위마다 커밋.
- **local/devel 작업**: devel에서 직접 작업하지 않고 `local/devel` 브랜치에서 작업한다. 타스크 브랜치도 `local/devel`에서 분기하고 `local/devel`로 merge한다.
- **devel merge**: `local/devel` → `devel` merge. 관련 타스크를 묶어서 진행.
- **main merge + 태그**: 릴리즈 시점에 devel → main merge 후 태그 생성.
- **원격 push**: devel, main merge 시 push. `local/devel` 및 타스크 브랜치는 로컬 유지.

### 타스크 번호 관리

- **GitHub Issues**를 타스크 번호로 사용한다. 자동 채번으로 중복 방지.
- **마일스톤 표기**: `M{버전}` (예: M100=v1.0.0, M05x=v0.5.x)
- 새 타스크 등록: `gh issue create --repo edwardkim/rhwp --title "제목" --body "설명" --milestone "v1.0.0"`
- 브랜치명: `local/task{issue번호}` (예: `local/task1`)
- 커밋 메시지: `Task #1: 내용` (Issue 번호 참조)
- `mydocs/orders/`에서 `M100 #1` 형식으로 마일스톤+이슈 참조
- 타스크 완료 시: `gh issue close {번호}` 또는 커밋 메시지에 `closes #번호`

### 타스크 진행 절차

1. GitHub Issue에 타스크 등록 → 작업지시자가 지정한 타스크 수행
2. `local/task{issue번호}` 브랜치 생성 후 진행
3. 수행 전 수행계획서 작성 → 승인 요청
4. 구현 계획서 작성 (최소 3단계, 최대 6단계) → 승인 요청
5. 단계별 진행 시작
6. 각 단계 완료 후 단계별 완료보고서 작성 → 승인 요청
7. 승인 후 다음 단계 진행
8. 모든 단계 완료 시 최종 결과 보고서 작성 → 승인 요청
9. 승인 요청 시 작업지시자가 피드백 문서를 `mydocs/feedback/`에 등록
10. 모든 테스트 통과 시 피드백 없음
11. 최종 결과보고서 작성 후 오늘할일 해당 타스크 상태 갱신

### 작업 규칙

- 작업 시간의 시작과 종료는 작업지시자가 결정한다. 클로드가 임의로 작업 종료를 제안하거나 시간을 한정하지 않는다.
