import Foundation

public struct HwpingQuickLookDocumentEntry {
    public let fileURL: URL
    public let snapshot: HwpingQuickLookSnapshot

    public init(fileURL: URL, snapshot: HwpingQuickLookSnapshot) {
        self.fileURL = fileURL
        self.snapshot = snapshot
    }
}
