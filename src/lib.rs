use wasm_bindgen::prelude::*;

pub mod model;
pub mod parser;
pub mod renderer;
pub mod serializer;
pub mod error;
pub mod document_core;
pub mod wasm_api;
pub mod wmf;

pub use parser::{DocumentParser, parse_document};
pub use serializer::{DocumentSerializer, serialize_document};
pub use document_core::DocumentCore;
pub use error::HwpError;
pub use model::event::DocumentEvent;

/// WASM panic hook 초기화 (한 번만 실행)
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version() {
        assert_eq!(version(), env!("CARGO_PKG_VERSION"));
    }
}
