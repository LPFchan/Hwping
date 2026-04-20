# hwping-electron

This directory contains the phase 1 Electron desktop shell.

It hosts the shared `rhwp-studio/` renderer behind a local HTTP server, then uses a thin preload bridge for file dialogs, file reads and writes, menu-command IPC, and recent-document loading.

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

The Electron shell is intentionally thin. The shared renderer still owns document UI, while the main process only handles app lifecycle, menu routing, and file-system integration.
