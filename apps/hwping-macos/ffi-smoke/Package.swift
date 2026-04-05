// swift-tools-version: 6.1

import PackageDescription

let package = Package(
    name: "HwpingFFISmoke",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .executable(name: "HwpingFFISmoke", targets: ["HwpingFFISmoke"]),
    ],
    targets: [
        .systemLibrary(
            name: "CHwpingFFI",
            path: "Sources/CHwpingFFI"
        ),
        .executableTarget(
            name: "HwpingFFISmoke",
            dependencies: ["CHwpingFFI"],
            path: "Sources/HwpingFFISmoke",
            linkerSettings: [
                .unsafeFlags(["-L", "../../../target/debug"]),
            ]
        ),
    ]
)