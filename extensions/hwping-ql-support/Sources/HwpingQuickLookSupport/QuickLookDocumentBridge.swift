import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

import CHwpingFFI

public struct HwpingQuickLookSnapshot {
    public let fileName: String
    public let pageCount: Int
    public let firstPageSize: CGSize
    public let previewPDF: Data
}

public enum HwpingQuickLookSupportError: Error, CustomStringConvertible {
    case openFailed(String)
    case ffiFailed(String)
    case missingPreviewBuffer
    case thumbnailCreationFailed

    public var description: String {
        switch self {
        case .openFailed(let message):
            return "open failed: \(message)"
        case .ffiFailed(let message):
            return "ffi failed: \(message)"
        case .missingPreviewBuffer:
            return "preview buffer was empty"
        case .thumbnailCreationFailed:
            return "thumbnail creation failed"
        }
    }
}

public final class HwpingQuickLookDocumentBridge {
    public init() {}

    public func snapshot(at fileURL: URL) throws -> HwpingQuickLookSnapshot {
        let handle = try openHandle(for: fileURL)
        defer { hwping_document_free(handle) }

        var info = HwpingDocumentInfo()
        try check(hwping_document_get_info(handle, &info), context: "document info")

        var pageInfo = HwpingPageInfo()
        try check(hwping_document_get_first_page_info(handle, &pageInfo), context: "first page info")

        var buffer = HwpingBuffer()
        try check(hwping_document_generate_preview_pdf(handle, &buffer), context: "preview pdf")
        defer { hwping_buffer_free(buffer) }

        guard let ptr = buffer.ptr, buffer.len > 0 else {
            throw HwpingQuickLookSupportError.missingPreviewBuffer
        }

        let previewPDF = Data(bytes: ptr, count: buffer.len)
        return HwpingQuickLookSnapshot(
            fileName: fileURL.lastPathComponent,
            pageCount: Int(info.page_count),
            firstPageSize: CGSize(width: pageInfo.width_px, height: pageInfo.height_px),
            previewPDF: previewPDF
        )
    }

    public func previewPDF(at fileURL: URL) throws -> Data {
        return try snapshot(at: fileURL).previewPDF
    }

    public func thumbnailPNG(at fileURL: URL, maximumSize: CGSize) throws -> Data {
        let snapshot = try snapshot(at: fileURL)
        return try renderThumbnailPNG(from: snapshot.previewPDF, maximumSize: maximumSize)
    }

    private func openHandle(for fileURL: URL) throws -> OpaquePointer {
        var handle: OpaquePointer?
        try fileURL.path.withCString { pathCString in
            try check(hwping_document_open(pathCString, &handle), context: "open document")
        }

        guard let handle else {
            throw HwpingQuickLookSupportError.openFailed("missing document handle")
        }
        return handle
    }

    private func check(_ status: HwpingStatus, context: String) throws {
        if status == HWPING_STATUS_OK {
            return
        }

        let message = lastErrorMessage()
        throw HwpingQuickLookSupportError.ffiFailed("\(context): \(message) [status=\(status)]")
    }

    private func lastErrorMessage() -> String {
        guard let cString = hwping_last_error_message() else {
            return "unknown ffi error"
        }

        return String(cString: cString)
    }

    private func renderThumbnailPNG(from previewPDF: Data, maximumSize: CGSize) throws -> Data {
        guard let provider = CGDataProvider(data: previewPDF as CFData),
              let pdf = CGPDFDocument(provider),
              let page = pdf.page(at: 1) else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        let mediaBox = page.getBoxRect(.mediaBox)
        guard mediaBox.width > 0, mediaBox.height > 0 else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        let scale = min(maximumSize.width / mediaBox.width, maximumSize.height / mediaBox.height)
        let outputWidth = max(1, Int((mediaBox.width * scale).rounded(.up)))
        let outputHeight = max(1, Int((mediaBox.height * scale).rounded(.up)))

        let colorSpace = CGColorSpaceCreateDeviceRGB()
        guard let context = CGContext(
            data: nil,
            width: outputWidth,
            height: outputHeight,
            bitsPerComponent: 8,
            bytesPerRow: 0,
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        context.interpolationQuality = .high
        context.setFillColor(.clear)
        context.fill(CGRect(x: 0, y: 0, width: outputWidth, height: outputHeight))

        context.saveGState()
        context.translateBy(x: 0, y: CGFloat(outputHeight))
        context.scaleBy(x: scale, y: -scale)
        context.drawPDFPage(page)
        context.restoreGState()

        guard let image = context.makeImage() else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        return try pngData(from: image)
    }

    private func pngData(from image: CGImage) throws -> Data {
        let data = NSMutableData()
        guard let destination = CGImageDestinationCreateWithData(
            data,
            UTType.png.identifier as CFString,
            1,
            nil
        ) else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        CGImageDestinationAddImage(destination, image, nil)
        guard CGImageDestinationFinalize(destination) else {
            throw HwpingQuickLookSupportError.thumbnailCreationFailed
        }

        return data as Data
    }
}
