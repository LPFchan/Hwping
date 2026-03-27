//! 페이지 분할 (Pagination)
//!
//! IR(Document Model)의 문단 목록을 페이지 단위로 분할한다.
//! 각 페이지에 어떤 문단(또는 문단의 일부)이 배치되는지 결정한다.
//!
//! 2-패스 페이지네이션:
//! 1. HeightMeasurer로 모든 콘텐츠의 실제 렌더링 높이를 측정
//! 2. 측정된 높이를 기반으로 정확한 페이지 분할 수행

use crate::model::control::Control;
use crate::model::header_footer::HeaderFooterApply;
use crate::model::paragraph::{Paragraph, ColumnBreakType};
use crate::model::page::{PageDef, ColumnDef};
use crate::model::shape::CaptionDirection;
use super::composer::ComposedParagraph;
use super::height_measurer::{HeightMeasurer, MeasuredSection};
use super::page_layout::PageLayoutInfo;
use super::style_resolver::ResolvedStyleSet;

/// 페이지 분할 결과: 페이지별 콘텐츠 참조
#[derive(Debug)]
pub struct PaginationResult {
    /// 페이지별 콘텐츠 목록
    pub pages: Vec<PageContent>,
    /// 어울림 배치 표와 나란히 배치되는 빈 리턴 문단 목록 (전체)
    pub wrap_around_paras: Vec<WrapAroundPara>,
    /// 빈 줄 감추기로 높이 0 처리된 문단 인덱스 집합
    pub hidden_empty_paras: std::collections::HashSet<usize>,
}

/// 한 페이지에 배치될 콘텐츠
#[derive(Debug)]
pub struct PageContent {
    /// 페이지 인덱스 (0-based)
    pub page_index: u32,
    /// 실제 쪽 번호 (NewNumber 반영, 1-based)
    pub page_number: u32,
    /// 소속 구역 인덱스
    pub section_index: usize,
    /// 페이지 레이아웃 정보
    pub layout: PageLayoutInfo,
    /// 단별 콘텐츠
    pub column_contents: Vec<ColumnContent>,
    /// 이 페이지에 적용할 머리말 (None이면 머리말 없음)
    pub active_header: Option<HeaderFooterRef>,
    /// 이 페이지에 적용할 꼬리말 (None이면 꼬리말 없음)
    pub active_footer: Option<HeaderFooterRef>,
    /// 쪽 번호 위치 (None이면 쪽 번호 표시 안 함)
    pub page_number_pos: Option<crate::model::control::PageNumberPos>,
    /// 감추기 설정 (None이면 감추기 없음)
    pub page_hide: Option<crate::model::control::PageHide>,
    /// 이 페이지에 배치될 각주 목록
    pub footnotes: Vec<FootnoteRef>,
    /// 이 페이지에 적용할 바탕쪽 (None이면 바탕쪽 없음)
    pub active_master_page: Option<MasterPageRef>,
    /// 확장 바탕쪽 (임의 쪽 등, 기본 바탕쪽에 추가로 적용)
    pub extra_master_pages: Vec<MasterPageRef>,
}

/// 바탕쪽 참조
#[derive(Debug, Clone)]
pub struct MasterPageRef {
    /// 구역 인덱스
    pub section_index: usize,
    /// master_pages 배열 내 인덱스
    pub master_page_index: usize,
}

/// 머리말/꼬리말 참조
#[derive(Debug, Clone)]
pub struct HeaderFooterRef {
    /// Header/Footer 컨트롤이 있는 문단 인덱스
    pub para_index: usize,
    /// 해당 문단 내 컨트롤 인덱스
    pub control_index: usize,
    /// Header/Footer 컨트롤이 속한 구역 인덱스 (구역 간 상속 시 원본 구역 추적용)
    pub source_section_index: usize,
}

/// 각주 출처 (본문 문단 또는 표 셀 내)
#[derive(Debug, Clone)]
pub enum FootnoteSource {
    /// 본문 문단 내 각주
    Body {
        para_index: usize,
        control_index: usize,
    },
    /// 표 셀 내 각주
    TableCell {
        para_index: usize,
        table_control_index: usize,
        cell_index: usize,
        cell_para_index: usize,
        cell_control_index: usize,
    },
    /// 글상자(Shape TextBox) 내 각주
    ShapeTextBox {
        para_index: usize,
        shape_control_index: usize,
        tb_para_index: usize,
        tb_control_index: usize,
    },
}

/// 페이지에 배치되는 각주 참조
#[derive(Debug, Clone)]
pub struct FootnoteRef {
    /// 각주 번호 (1-based)
    pub number: u16,
    /// 출처
    pub source: FootnoteSource,
}

/// 한 단(Column)에 배치될 콘텐츠
#[derive(Debug)]
pub struct ColumnContent {
    /// 단 인덱스 (0-based)
    pub column_index: u16,
    /// 배치될 문단 슬라이스 정보
    pub items: Vec<PageItem>,
    /// 이 존의 레이아웃 (None이면 page.layout 사용). 다단 설정 나누기로 같은 페이지 내 단 수 변경 시 사용.
    pub zone_layout: Option<PageLayoutInfo>,
    /// 이 존의 body_area 내 y 시작 오프셋 (px). 이전 존의 높이만큼 아래로 밀림.
    pub zone_y_offset: f64,
    /// 어울림 배치 표와 나란히 배치되는 빈 리턴 문단 인덱스 목록
    /// (표 오른쪽에 문단 부호를 표시하기 위해 사용)
    pub wrap_around_paras: Vec<WrapAroundPara>,
}

/// 어울림 배치 표 옆에 배치되는 빈 리턴 문단 정보
#[derive(Debug, Clone)]
pub struct WrapAroundPara {
    /// 어울림 문단의 인덱스
    pub para_index: usize,
    /// 연관된 표의 문단 인덱스
    pub table_para_index: usize,
    /// 텍스트가 있는 문단인지 (false면 빈 리턴)
    pub has_text: bool,
}

/// 페이지에 배치되는 개별 항목
#[derive(Debug)]
pub enum PageItem {
    /// 문단 전체가 배치됨
    FullParagraph {
        /// 원본 문단 인덱스
        para_index: usize,
    },
    /// 문단 일부가 배치됨 (페이지 넘김)
    PartialParagraph {
        /// 원본 문단 인덱스
        para_index: usize,
        /// 시작 줄 인덱스 (LineSeg 인덱스)
        start_line: usize,
        /// 끝 줄 인덱스 (exclusive)
        end_line: usize,
    },
    /// 표 전체
    Table {
        /// 원본 문단 내 컨트롤 인덱스
        para_index: usize,
        control_index: usize,
    },
    /// 표의 일부 행만 배치 (페이지 분할)
    PartialTable {
        /// 원본 문단 인덱스
        para_index: usize,
        /// 컨트롤 인덱스
        control_index: usize,
        /// 시작 행 (inclusive)
        start_row: usize,
        /// 끝 행 (exclusive)
        end_row: usize,
        /// 연속 페이지 여부 (true면 제목행 반복)
        is_continuation: bool,
        /// 시작행 콘텐츠 시작 오프셋 (px, 패딩 제외). 0.0=처음부터.
        split_start_content_offset: f64,
        /// (end_row-1)행 최대 콘텐츠 높이 제한 (px, 패딩 제외). 0.0=전부.
        split_end_content_limit: f64,
    },
    /// 그리기 개체
    Shape {
        /// 원본 문단 내 컨트롤 인덱스
        para_index: usize,
        control_index: usize,
    },
}

/// 페이지 분할 엔진
pub struct Paginator {
    /// DPI
    dpi: f64,
}

impl Paginator {
    pub fn new(dpi: f64) -> Self {
        Self { dpi }
    }

    /// 기본 DPI(96)로 생성
    pub fn with_default_dpi() -> Self {
        Self::new(super::DEFAULT_DPI)
    }

    /// 문단 내 단 경계를 감지한다.
    /// HWP에서 같은 너비 다단 레이아웃의 문단은 한 문단이 여러 단에 걸칠 수 있다.
    /// LineSeg의 vertical_pos가 급격히 감소(이전 줄의 vpos보다 작아짐)하면 단이 변경된 것.
    /// 반환: 각 단의 시작 줄 인덱스 목록 (첫 번째는 항상 0)
    fn detect_column_breaks_in_paragraph(para: &Paragraph) -> Vec<usize> {
        let mut breaks = vec![0usize];
        if para.line_segs.len() <= 1 {
            return breaks;
        }
        for i in 1..para.line_segs.len() {
            let prev_vpos = para.line_segs[i - 1].vertical_pos;
            let curr_vpos = para.line_segs[i].vertical_pos;
            // vpos가 이전보다 작아지면 단 경계
            if curr_vpos < prev_vpos {
                breaks.push(i);
            }
        }
        breaks
    }

    /// 구역의 문단 목록을 페이지로 분할한다.
    ///
    /// 2-패스 페이지네이션:
    /// 1. HeightMeasurer로 모든 콘텐츠의 실제 렌더링 높이를 사전 측정
    /// 2. 측정된 높이를 기반으로 정확한 페이지 분할 수행
    ///
    /// - 본문 영역 높이를 초과하면 새 페이지 시작
    /// - ColumnBreakType::Page이면 강제 페이지 넘김
    pub fn paginate(
        &self,
        paragraphs: &[Paragraph],
        composed: &[ComposedParagraph],
        styles: &ResolvedStyleSet,
        page_def: &PageDef,
        column_def: &ColumnDef,
        section_index: usize,
    ) -> (PaginationResult, MeasuredSection) {
        // === 1-패스: 높이 사전 측정 ===
        let measurer = HeightMeasurer::new(self.dpi);
        let measured = measurer.measure_section(paragraphs, composed, styles);

        // === 2-패스: 측정된 높이로 페이지 분할 ===
        let result = self.paginate_with_measured(paragraphs, &measured, page_def, column_def, section_index, &styles.para_styles);
        (result, measured)
    }
}

mod engine;
mod state;

#[cfg(test)]
mod tests;
