//! PaginationState: paginate_with_measured의 가변 상태를 캡슐화

use crate::renderer::page_layout::PageLayoutInfo;
use super::{PageContent, ColumnContent, PageItem, WrapAroundPara};

/// paginate_with_measured의 12+ 가변 상태 변수를 구조체로 통합
pub(super) struct PaginationState {
    pub pages: Vec<PageContent>,
    pub current_items: Vec<PageItem>,
    pub current_height: f64,
    pub current_column: u16,
    pub current_footnote_height: f64,
    pub is_first_footnote_on_page: bool,
    pub col_count: u16,
    pub layout: PageLayoutInfo,
    pub current_zone_y_offset: f64,
    pub current_zone_layout: Option<PageLayoutInfo>,
    pub on_first_multicolumn_page: bool,
    pub section_index: usize,
    pub footnote_separator_overhead: f64,
    pub footnote_safety_margin: f64,
    /// 현재 단에 축적된 어울림 리턴 문단 목록
    pub current_column_wrap_around_paras: Vec<WrapAroundPara>,
    /// 현재 페이지의 vpos 기준점 (첫 문단의 vertical_pos, HWPUNIT)
    /// layout의 vpos 보정과 동기화하기 위해 사용
    pub page_vpos_base: Option<i32>,
    /// 현재 페이지에 비-TAC 블록 표가 존재하는지 (vpos drift 보정용)
    pub page_has_block_table: bool,
}

impl PaginationState {
    pub fn new(
        layout: PageLayoutInfo,
        col_count: u16,
        section_index: usize,
        footnote_separator_overhead: f64,
        footnote_safety_margin: f64,
    ) -> Self {
        Self {
            pages: Vec::new(),
            current_items: Vec::new(),
            current_height: 0.0,
            current_column: 0,
            current_footnote_height: 0.0,
            is_first_footnote_on_page: true,
            col_count,
            layout,
            current_zone_y_offset: 0.0,
            current_zone_layout: None,
            on_first_multicolumn_page: false,
            section_index,
            footnote_separator_overhead,
            footnote_safety_margin,
            current_column_wrap_around_paras: Vec::new(),
            page_vpos_base: None,
            page_has_block_table: false,
        }
    }

    /// 현재 항목을 ColumnContent로 만들어 마지막 페이지에 push
    pub fn flush_column(&mut self) {
        if self.current_items.is_empty() {
            return;
        }
        let col_content = ColumnContent {
            column_index: self.current_column,
            items: std::mem::take(&mut self.current_items),
            zone_layout: self.current_zone_layout.clone(),
            zone_y_offset: self.current_zone_y_offset,
            wrap_around_paras: std::mem::take(&mut self.current_column_wrap_around_paras),
        };
        if let Some(page) = self.pages.last_mut() {
            page.column_contents.push(col_content);
        } else {
            self.pages.push(self.new_page_content(vec![col_content]));
        }
    }

    /// 현재 항목을 ColumnContent로 만들어 (비어있어도) 마지막 페이지에 push
    pub fn flush_column_always(&mut self) {
        let col_content = ColumnContent {
            column_index: self.current_column,
            items: std::mem::take(&mut self.current_items),
            zone_layout: self.current_zone_layout.clone(),
            zone_y_offset: self.current_zone_y_offset,
            wrap_around_paras: std::mem::take(&mut self.current_column_wrap_around_paras),
        };
        if let Some(page) = self.pages.last_mut() {
            page.column_contents.push(col_content);
        } else {
            self.pages.push(self.new_page_content(vec![col_content]));
        }
    }

    /// 다음 단으로 이동하거나, 마지막 단이면 새 페이지 생성
    pub fn advance_column_or_new_page(&mut self) {
        self.flush_column();
        if self.current_column + 1 < self.col_count {
            self.current_column += 1;
            self.current_height = 0.0;
        } else {
            self.push_new_page();
        }
    }

    /// 강제 새 페이지 (쪽 나누기)
    pub fn force_new_page(&mut self) {
        self.flush_column();
        self.push_new_page();
    }

    /// 페이지가 비어있으면 첫 페이지 생성
    pub fn ensure_page(&mut self) {
        if self.pages.is_empty() {
            self.pages.push(self.new_page_content(Vec::new()));
        }
    }

    /// 사용 가능한 본문 높이 (각주 영역, 안전 여백, 존 오프셋 제외)
    pub fn available_height(&self) -> f64 {
        let base = self.layout.available_body_height();
        let fn_margin = if self.current_footnote_height > 0.0 {
            self.footnote_safety_margin
        } else {
            0.0
        };
        (base - self.current_footnote_height - fn_margin - self.current_zone_y_offset).max(0.0)
    }

    /// base_available_height (각주/존 오프셋 미차감)
    pub fn base_available_height(&self) -> f64 {
        self.layout.available_body_height()
    }

    /// 각주 높이 추가
    pub fn add_footnote_height(&mut self, height: f64) {
        if self.is_first_footnote_on_page {
            self.current_footnote_height += self.footnote_separator_overhead;
            self.is_first_footnote_on_page = false;
        }
        self.current_footnote_height += height;
    }

    /// 새 페이지 push + 상태 리셋
    fn push_new_page(&mut self) {
        self.pages.push(self.new_page_content(Vec::new()));
        self.reset_for_new_page();
    }

    /// 새 페이지 상태 리셋
    fn reset_for_new_page(&mut self) {
        self.current_column = 0;
        self.current_height = 0.0;
        self.current_footnote_height = 0.0;
        self.is_first_footnote_on_page = true;
        self.page_vpos_base = None;
        self.page_has_block_table = false;
        self.current_zone_y_offset = 0.0;
        self.current_zone_layout = None;
        self.on_first_multicolumn_page = false;
        self.current_column_wrap_around_paras.clear();
    }

    /// PageContent 생성 헬퍼
    fn new_page_content(&self, column_contents: Vec<ColumnContent>) -> PageContent {
        PageContent {
            page_index: self.pages.len() as u32,
            page_number: 0,
            section_index: self.section_index,
            layout: self.layout.clone(),
            column_contents,
            active_header: None,
            active_footer: None,
            page_number_pos: None,
            page_hide: None,
            footnotes: Vec::new(),
            active_master_page: None,
            extra_master_pages: Vec::new(),
        }
    }
}
