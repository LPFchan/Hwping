import CHwpingFFI
import Foundation

struct SmokeError: Error, CustomStringConvertible {
    let message: String

    var description: String {
        message
    }
}

func lastErrorMessage() -> String {
    guard let cString = hwping_last_error_message() else {
        return "unknown ffi error"
    }

    return String(cString: cString)
}

func check(_ status: HwpingStatus, context: String) throws {
    if status == HWPING_STATUS_OK {
        return
    }

    throw SmokeError(message: "\(context): \(lastErrorMessage()) [status=\(status)]")
}

func main() throws {
    let arguments = CommandLine.arguments
    guard arguments.count >= 2 else {
        throw SmokeError(message: "usage: HwpingFFISmoke <input.hwp> [output.pdf]")
    }

    let inputPath = arguments[1]
    let outputPath = arguments.count >= 3 ? arguments[2] : "ffi-smoke-preview.pdf"

    var handle: OpaquePointer?
    try inputPath.withCString { pathCString in
        try check(hwping_document_open(pathCString, &handle), context: "open document")
    }

    guard let handle else {
        throw SmokeError(message: "open document succeeded without returning a handle")
    }
    defer {
        hwping_document_free(handle)
    }

    var documentInfo = HwpingDocumentInfo()
    try check(hwping_document_get_info(handle, &documentInfo), context: "read document info")

    var pageInfo = HwpingPageInfo()
    try check(hwping_document_get_first_page_info(handle, &pageInfo), context: "read first page info")

    var pdfBuffer = HwpingBuffer()
    try check(hwping_document_generate_preview_pdf(handle, &pdfBuffer), context: "generate preview pdf")
    defer {
        hwping_buffer_free(pdfBuffer)
    }

    guard let pdfPointer = pdfBuffer.ptr else {
        throw SmokeError(message: "generate preview pdf returned an empty buffer")
    }

    let data = Data(bytes: pdfPointer, count: Int(pdfBuffer.len))
    try data.write(to: URL(fileURLWithPath: outputPath))

    print("Opened: \(inputPath)")
    print(
        "Document version: \(documentInfo.version_major).\(documentInfo.version_minor).\(documentInfo.version_build).\(documentInfo.version_revision)"
    )
    print("Sections: \(documentInfo.section_count)")
    print("Pages: \(documentInfo.page_count)")
    print(
        String(
            format: "First page: section=%u size=%ux%u HWPUNIT (%.1fx%.1f px)",
            pageInfo.section_index,
            pageInfo.width_hwp,
            pageInfo.height_hwp,
            pageInfo.width_px,
            pageInfo.height_px
        )
    )
    print("Preview PDF: \(outputPath)")
}

do {
    try main()
} catch {
    fputs("\(error)\n", stderr)
    exit(1)
}