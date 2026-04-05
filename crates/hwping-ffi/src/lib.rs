//! Swift-facing FFI boundary for Hwping.
//!
//! M0 only establishes the crate boundary. ABI decisions will be added in M1.

pub fn crate_boundary_ready() -> bool {
    hwping_core::crate_boundary_ready()
}