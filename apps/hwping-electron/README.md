# hwping-electron

This directory contains the phase 1 Electron desktop wrapper.

It hosts the shared `rhwp-studio/` renderer behind a local HTTP server, then uses a thin preload bridge for file dialogs, file reads and writes, menu-command IPC, recent-document loading, and native menu state sync.

`npm run build` now produces a local `dist/Hwping.app` bundle with document association for `.hwp` and `.hwpx`, so the wrapper can be opened like a normal macOS app during phase 1.

## Build

```bash
cd apps/hwping-electron
npm install
npm run build
```

## Run

```bash
npm start
```

The Electron wrapper is intentionally thin. The shared renderer still owns document UI, while the main process handles app lifecycle, the macOS app menu, recent documents, and file-system integration.
