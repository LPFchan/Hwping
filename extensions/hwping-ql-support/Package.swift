// swift-tools-version: 6.1

import PackageDescription

let package = Package(
    name: "HwpingQuickLookSupport",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "HwpingQuickLookSupport", targets: ["HwpingQuickLookSupport"]),
    ],
    targets: [
        .systemLibrary(
            name: "CHwpingFFI",
            path: "Sources/CHwpingFFI"
        ),
        .target(
            name: "HwpingQuickLookSupport",
            dependencies: ["CHwpingFFI"],
            path: "Sources/HwpingQuickLookSupport",
            linkerSettings: [
                .unsafeFlags(["-L", "../../target/debug"]),
            ]
        ),
    ]
)
