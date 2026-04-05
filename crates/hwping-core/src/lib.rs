//! App-facing facade layer for Hwping.

use std::fmt;
use std::fs;
use std::path::Path;

use rhwp::renderer::{hwpunit_to_px, DEFAULT_DPI};

pub type HwpingResult<T> = Result<T, HwpingError>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(i32)]
pub enum HwpingErrorCode {
    InvalidArgument = 1,
    Io = 2,
    InvalidFile = 3,
    PageOutOfRange = 4,
    RenderFailed = 5,
    Utf8 = 6,
    Internal = 7,
}

#[derive(Debug, Clone)]
pub struct HwpingError {
    code: HwpingErrorCode,
    message: String,
}

impl HwpingError {
    pub fn new(code: HwpingErrorCode, message: impl Into<String>) -> Self {
        Self { code, message: message.into() }
    }

    pub fn code(&self) -> HwpingErrorCode {
        self.code
    }

    pub fn message(&self) -> &str {
        &self.message
    }
}

impl fmt::Display for HwpingError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl std::error::Error for HwpingError {}

impl From<std::io::Error> for HwpingError {
    fn from(error: std::io::Error) -> Self {
        Self::new(HwpingErrorCode::Io, error.to_string())
    }
}

impl From<rhwp::HwpError> for HwpingError {
    fn from(error: rhwp::HwpError) -> Self {
        let code = match &error {
            rhwp::HwpError::InvalidFile(_) => HwpingErrorCode::InvalidFile,
            rhwp::HwpError::PageOutOfRange(_) => HwpingErrorCode::PageOutOfRange,
            rhwp::HwpError::RenderError(_) => HwpingErrorCode::RenderFailed,
            rhwp::HwpError::InvalidField(_) => HwpingErrorCode::InvalidArgument,
        };

        Self::new(code, error.to_string())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct HwpingVersion {
    pub major: u8,
    pub minor: u8,
    pub build: u8,
    pub revision: u8,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct HwpingDocumentInfo {
    pub version: HwpingVersion,
    pub section_count: u32,
    pub page_count: u32,
    pub encrypted: bool,
    pub compressed: bool,
    pub distribution: bool,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct HwpingPageInfo {
    pub page_index: u32,
    pub section_index: u32,
    pub width_hwp: u32,
    pub height_hwp: u32,
    pub width_px: f64,
    pub height_px: f64,
}

pub struct HwpingDocument {
    core: rhwp::DocumentCore,
}

impl HwpingDocument {
    pub fn open<P: AsRef<Path>>(path: P) -> HwpingResult<Self> {
        let bytes = fs::read(path)?;
        Self::from_bytes(&bytes)
    }

    pub fn from_bytes(bytes: &[u8]) -> HwpingResult<Self> {
        let core = rhwp::DocumentCore::from_bytes(bytes)?;
        Ok(Self { core })
    }

    pub fn document_info(&self) -> HwpingDocumentInfo {
        let document = self.core.document();

        HwpingDocumentInfo {
            version: HwpingVersion {
                major: document.header.version.major,
                minor: document.header.version.minor,
                build: document.header.version.build,
                revision: document.header.version.revision,
            },
            section_count: document.sections.len() as u32,
            page_count: self.core.page_count(),
            encrypted: document.header.encrypted,
            compressed: document.header.compressed,
            distribution: document.header.distribution,
        }
    }

    pub fn first_page_info(&self) -> HwpingResult<HwpingPageInfo> {
        let document = self.core.document();
        let section = document.sections.first().ok_or_else(|| {
            HwpingError::new(HwpingErrorCode::InvalidFile, "document does not contain any sections")
        })?;
        let page_def = &section.section_def.page_def;
        let (width_hwp, height_hwp) = if page_def.landscape {
            (page_def.height, page_def.width)
        } else {
            (page_def.width, page_def.height)
        };

        Ok(HwpingPageInfo {
            page_index: 0,
            section_index: 0,
            width_hwp,
            height_hwp,
            width_px: hwpunit_to_px(width_hwp as i32, DEFAULT_DPI),
            height_px: hwpunit_to_px(height_hwp as i32, DEFAULT_DPI),
        })
    }

    pub fn preview_pdf(&self) -> HwpingResult<Vec<u8>> {
        let page_count = self.core.page_count();
        let mut pages = Vec::with_capacity(page_count as usize);

        for page_index in 0..page_count {
            pages.push(self.core.render_page_svg_native(page_index)?);
        }

        rhwp::renderer::pdf::svgs_to_pdf(&pages)
            .map_err(|message| HwpingError::new(HwpingErrorCode::RenderFailed, message))
    }

    pub fn into_inner(self) -> rhwp::DocumentCore {
        self.core
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_path() -> String {
        format!(
            "{}/../../samples/re-01-hangul-only.hwp",
            env!("CARGO_MANIFEST_DIR")
        )
    }

    #[test]
    fn opens_document_and_generates_preview_pdf() {
        let document = HwpingDocument::open(sample_path()).expect("sample document should open");
        let info = document.document_info();
        let first_page = document.first_page_info().expect("first page info should exist");
        let pdf = document.preview_pdf().expect("preview pdf should render");

        assert!(info.page_count > 0);
        assert!(first_page.width_hwp > 0);
        assert!(first_page.height_hwp > 0);
        assert!(pdf.starts_with(b"%PDF"));
    }
}