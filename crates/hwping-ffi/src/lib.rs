//! Swift-facing FFI boundary for Hwping.

use std::cell::RefCell;
use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use std::ptr;

use hwping_core::{HwpingDocument, HwpingDocumentInfo, HwpingError, HwpingErrorCode, HwpingPageInfo};

pub type HwpingStatus = i32;

pub const HWPING_STATUS_OK: HwpingStatus = 0;

thread_local! {
    static LAST_ERROR_MESSAGE: RefCell<Option<CString>> = const { RefCell::new(None) };
}

pub struct HwpingDocumentHandle {
    document: HwpingDocument,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct HwpingFfiDocumentInfo {
    pub version_major: u8,
    pub version_minor: u8,
    pub version_build: u8,
    pub version_revision: u8,
    pub section_count: u32,
    pub page_count: u32,
    pub encrypted: u8,
    pub compressed: u8,
    pub distribution: u8,
    pub reserved: u8,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct HwpingFfiPageInfo {
    pub page_index: u32,
    pub section_index: u32,
    pub width_hwp: u32,
    pub height_hwp: u32,
    pub width_px: f64,
    pub height_px: f64,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct HwpingBuffer {
    pub ptr: *mut u8,
    pub len: usize,
}

impl From<HwpingDocumentInfo> for HwpingFfiDocumentInfo {
    fn from(info: HwpingDocumentInfo) -> Self {
        Self {
            version_major: info.version.major,
            version_minor: info.version.minor,
            version_build: info.version.build,
            version_revision: info.version.revision,
            section_count: info.section_count,
            page_count: info.page_count,
            encrypted: u8::from(info.encrypted),
            compressed: u8::from(info.compressed),
            distribution: u8::from(info.distribution),
            reserved: 0,
        }
    }
}

impl From<HwpingPageInfo> for HwpingFfiPageInfo {
    fn from(info: HwpingPageInfo) -> Self {
        Self {
            page_index: info.page_index,
            section_index: info.section_index,
            width_hwp: info.width_hwp,
            height_hwp: info.height_hwp,
            width_px: info.width_px,
            height_px: info.height_px,
        }
    }
}

fn clear_last_error() {
    LAST_ERROR_MESSAGE.with(|slot| {
        *slot.borrow_mut() = None;
    });
}

fn set_last_error(error: HwpingError) -> HwpingStatus {
    let message = error.message().replace('\0', " ");
    let c_string = CString::new(message)
        .unwrap_or_else(|_| CString::new("hwping ffi error").expect("static string should be valid"));
    let code = error.code() as HwpingStatus;

    LAST_ERROR_MESSAGE.with(|slot| {
        *slot.borrow_mut() = Some(c_string);
    });

    code
}

fn invalid_argument(message: impl Into<String>) -> HwpingStatus {
    set_last_error(HwpingError::new(HwpingErrorCode::InvalidArgument, message))
}

unsafe fn read_path<'a>(path: *const c_char) -> Result<&'a str, HwpingStatus> {
    if path.is_null() {
        return Err(invalid_argument("path pointer must not be null"));
    }

    let path = unsafe { CStr::from_ptr(path) };
    path.to_str()
        .map_err(|_| set_last_error(HwpingError::new(HwpingErrorCode::Utf8, "path must be valid UTF-8")))
}

unsafe fn read_handle<'a>(
    handle: *const HwpingDocumentHandle,
) -> Result<&'a HwpingDocumentHandle, HwpingStatus> {
    unsafe { handle.as_ref() }
        .ok_or_else(|| invalid_argument("document handle must not be null"))
}

/// Returns the last FFI error message for the current thread.
#[no_mangle]
pub extern "C" fn hwping_last_error_message() -> *const c_char {
    LAST_ERROR_MESSAGE.with(|slot| {
        slot.borrow()
            .as_ref()
            .map(|message| message.as_ptr())
            .unwrap_or(ptr::null())
    })
}

/// Opens a document from a filesystem path.
///
/// # Safety
/// `path` must point to a valid NUL-terminated UTF-8 C string.
/// `out_handle` must point to writable storage for the returned handle.
#[no_mangle]
pub unsafe extern "C" fn hwping_document_open(
    path: *const c_char,
    out_handle: *mut *mut HwpingDocumentHandle,
) -> HwpingStatus {
    clear_last_error();

    if out_handle.is_null() {
        return invalid_argument("out_handle must not be null");
    }

    let path = match unsafe { read_path(path) } {
        Ok(path) => path,
        Err(code) => return code,
    };

    match HwpingDocument::open(path) {
        Ok(document) => {
            let handle = Box::new(HwpingDocumentHandle { document });
            unsafe {
                *out_handle = Box::into_raw(handle);
            }
            HWPING_STATUS_OK
        }
        Err(error) => set_last_error(error),
    }
}

/// Releases a document handle returned by `hwping_document_open`.
///
/// # Safety
/// `handle` must be either null or a pointer previously returned by
/// `hwping_document_open` that has not already been freed.
#[no_mangle]
pub unsafe extern "C" fn hwping_document_free(handle: *mut HwpingDocumentHandle) {
    if handle.is_null() {
        return;
    }

    unsafe {
        drop(Box::from_raw(handle));
    }
}

/// Retrieves normalized document metadata for an opened document.
///
/// # Safety
/// `handle` must be a valid handle returned by `hwping_document_open`.
/// `out_info` must point to writable storage.
#[no_mangle]
pub unsafe extern "C" fn hwping_document_get_info(
    handle: *const HwpingDocumentHandle,
    out_info: *mut HwpingFfiDocumentInfo,
) -> HwpingStatus {
    clear_last_error();

    if out_info.is_null() {
        return invalid_argument("out_info must not be null");
    }

    let handle = match unsafe { read_handle(handle) } {
        Ok(handle) => handle,
        Err(code) => return code,
    };

    unsafe {
        *out_info = handle.document.document_info().into();
    }

    HWPING_STATUS_OK
}

/// Retrieves the first-page size and section metadata for an opened document.
///
/// # Safety
/// `handle` must be a valid handle returned by `hwping_document_open`.
/// `out_info` must point to writable storage.
#[no_mangle]
pub unsafe extern "C" fn hwping_document_get_first_page_info(
    handle: *const HwpingDocumentHandle,
    out_info: *mut HwpingFfiPageInfo,
) -> HwpingStatus {
    clear_last_error();

    if out_info.is_null() {
        return invalid_argument("out_info must not be null");
    }

    let handle = match unsafe { read_handle(handle) } {
        Ok(handle) => handle,
        Err(code) => return code,
    };

    match handle.document.first_page_info() {
        Ok(info) => {
            unsafe {
                *out_info = info.into();
            }
            HWPING_STATUS_OK
        }
        Err(error) => set_last_error(error),
    }
}

/// Generates a preview PDF for the opened document.
///
/// # Safety
/// `handle` must be a valid handle returned by `hwping_document_open`.
/// `out_buffer` must point to writable storage.
#[no_mangle]
pub unsafe extern "C" fn hwping_document_generate_preview_pdf(
    handle: *const HwpingDocumentHandle,
    out_buffer: *mut HwpingBuffer,
) -> HwpingStatus {
    clear_last_error();

    if out_buffer.is_null() {
        return invalid_argument("out_buffer must not be null");
    }

    let handle = match unsafe { read_handle(handle) } {
        Ok(handle) => handle,
        Err(code) => return code,
    };

    match handle.document.preview_pdf() {
        Ok(mut bytes) => {
            let buffer = HwpingBuffer {
                ptr: bytes.as_mut_ptr(),
                len: bytes.len(),
            };
            std::mem::forget(bytes);

            unsafe {
                *out_buffer = buffer;
            }

            HWPING_STATUS_OK
        }
        Err(error) => set_last_error(error),
    }
}

/// Releases a byte buffer returned by `hwping_document_generate_preview_pdf`.
#[no_mangle]
pub extern "C" fn hwping_buffer_free(buffer: HwpingBuffer) {
    if buffer.ptr.is_null() || buffer.len == 0 {
        return;
    }

    unsafe {
        drop(Vec::from_raw_parts(buffer.ptr, buffer.len, buffer.len));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::ffi::CString;

    fn sample_path() -> CString {
        CString::new(format!(
            "{}/../../samples/re-01-hangul-only.hwp",
            env!("CARGO_MANIFEST_DIR")
        ))
        .expect("sample path should be a valid c string")
    }

    #[test]
    fn ffi_open_info_and_pdf_roundtrip() {
        let mut handle = ptr::null_mut();
        let status = unsafe { hwping_document_open(sample_path().as_ptr(), &mut handle) };
        assert_eq!(status, HWPING_STATUS_OK);
        assert!(!handle.is_null());

        let mut document_info = HwpingFfiDocumentInfo::default();
        let status = unsafe { hwping_document_get_info(handle, &mut document_info) };
        assert_eq!(status, HWPING_STATUS_OK);
        assert!(document_info.page_count > 0);

        let mut page_info = HwpingFfiPageInfo::default();
        let status = unsafe { hwping_document_get_first_page_info(handle, &mut page_info) };
        assert_eq!(status, HWPING_STATUS_OK);
        assert!(page_info.width_hwp > 0);

        let mut buffer = HwpingBuffer::default();
        let status = unsafe { hwping_document_generate_preview_pdf(handle, &mut buffer) };
        assert_eq!(status, HWPING_STATUS_OK);
        assert!(buffer.len > 4);

        let prefix = unsafe { std::slice::from_raw_parts(buffer.ptr, 4) };
        assert_eq!(prefix, b"%PDF");

        hwping_buffer_free(buffer);
        unsafe { hwping_document_free(handle) };
    }
}