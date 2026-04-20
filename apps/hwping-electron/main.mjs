import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RENDERER_ROOT = resolve(__dirname, 'dist', 'renderer');
const HWP_FILTERS = [{ name: 'HWP 문서', extensions: ['hwp', 'hwpx'] }];
const MAX_RECENTS = 8;

let mainWindow = null;
let rendererReady = false;
let rendererPort = 0;
let rendererServer = null;
const pendingOpenPaths = [];
const recentDocuments = [];

function ensureRendererBuilt() {
  const indexHtml = resolve(RENDERER_ROOT, 'index.html');
  if (!existsSync(indexHtml)) {
    throw new Error(`Renderer assets not found: ${indexHtml}. Run \`npm run build\` first.`);
  }
}

function normalizeBytes(bytes) {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

function contentTypeForPath(filePath) {
  switch (extname(filePath).toLowerCase()) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js':
    case '.mjs': return 'text/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.wasm': return 'application/wasm';
    default: return 'application/octet-stream';
  }
}

function safeResolveRendererPath(requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0].split('#')[0] || '/');
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const resolved = resolve(RENDERER_ROOT, relative);
  if (resolved !== RENDERER_ROOT && !resolved.startsWith(RENDERER_ROOT + sep)) return null;
  return resolved;
}

async function startRendererServer() {
  ensureRendererBuilt();

  rendererServer = createServer(async (req, res) => {
    try {
      const url = req.url || '/';
      let filePath = safeResolveRendererPath(url);
      if (!filePath) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      try {
        const fileStat = await stat(filePath);
        if (fileStat.isDirectory()) {
          filePath = resolve(filePath, 'index.html');
        }
      } catch {
        if (!filePath.endsWith('index.html')) {
          filePath = resolve(RENDERER_ROOT, 'index.html');
        }
      }

      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type': contentTypeForPath(filePath),
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(error));
    }
  });

  await new Promise((resolvePromise) => {
    rendererServer.listen(0, '127.0.0.1', () => {
      const address = rendererServer.address();
      if (address && typeof address === 'object') {
        rendererPort = address.port;
      }
      resolvePromise();
    });
  });
}

function buildMenuTemplate() {
  return [
    {
      label: '파일',
      submenu: [
        {
          label: '열기...',
          accelerator: 'CmdOrCtrl+O',
          click: () => sendMenuCommand('file:open'),
        },
        {
          label: '저장',
          accelerator: 'CmdOrCtrl+S',
          click: () => sendMenuCommand('file:save'),
        },
        {
          label: '인쇄',
          accelerator: 'CmdOrCtrl+P',
          click: () => sendMenuCommand('file:print'),
        },
        { type: 'separator' },
        {
          label: '최근 문서',
          submenu: buildRecentDocumentsSubmenu(),
        },
        { type: 'separator' },
        {
          label: '종료',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: '편집',
      submenu: [
        { role: 'undo', label: '되돌리기' },
        { role: 'redo', label: '다시 실행' },
        { type: 'separator' },
        { role: 'cut', label: '오려 두기' },
        { role: 'copy', label: '복사하기' },
        { role: 'paste', label: '붙이기' },
        { role: 'selectAll', label: '모두 선택' },
      ],
    },
    {
      label: '도움말',
      submenu: [
        {
          label: '제품 정보',
          click: () => sendMenuCommand('file:about'),
        },
      ],
    },
  ];
}

function buildRecentDocumentsSubmenu() {
  if (recentDocuments.length === 0) {
    return [{ label: '최근 문서 없음', enabled: false }];
  }

  return recentDocuments.map((filePath) => ({
    label: basename(filePath),
    click: () => void openPathInRenderer(filePath),
  }));
}

function refreshMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate()));
}

function sendMenuCommand(command) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send('hwping:menu-command', command);
}

function addRecentDocument(filePath) {
  const normalized = resolve(filePath);
  const currentIndex = recentDocuments.indexOf(normalized);
  if (currentIndex >= 0) recentDocuments.splice(currentIndex, 1);
  recentDocuments.unshift(normalized);
  recentDocuments.splice(MAX_RECENTS);
  app.addRecentDocument(normalized);
  refreshMenu();
}

async function openPathInRenderer(filePath) {
  try {
    const normalized = resolve(filePath);
    const bytes = normalizeBytes(await readFile(normalized));
    const payload = {
      filePath: normalized,
      name: basename(normalized),
      bytes,
    };

    addRecentDocument(normalized);

    if (!rendererReady || !mainWindow || mainWindow.isDestroyed()) {
      pendingOpenPaths.push(normalized);
      return;
    }

    mainWindow.webContents.send('hwping:open-document', payload);
  } catch (error) {
    dialog.showErrorBox('파일 열기 실패', String(error));
  }
}

function flushPendingOpenPaths() {
  if (!rendererReady || !mainWindow || mainWindow.isDestroyed()) return;
  while (pendingOpenPaths.length > 0) {
    const filePath = pendingOpenPaths.shift();
    if (filePath) {
      void openPathInRenderer(filePath);
    }
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    backgroundColor: '#f4efe8',
    title: 'Hwping',
    webPreferences: {
      preload: resolve(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      nativeWindowOpen: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'allow' }));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  await mainWindow.loadURL(`http://127.0.0.1:${rendererPort}/`);
}

function queueStartupDocuments() {
  const startupDocs = process.argv.slice(1).filter((arg) => /\.(hwp|hwpx)$/i.test(arg));
  for (const doc of startupDocs) {
    pendingOpenPaths.push(resolve(doc));
  }
}

function setupIpc() {
  ipcMain.handle('hwping:dialog-open', async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: options.types?.length
        ? options.types.map((type) => ({ name: type.description, extensions: Object.values(type.accept).flatMap((items) => items.map((item) => item.replace(/^\./, ''))) }))
        : HWP_FILTERS,
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = resolve(result.filePaths[0]);
    addRecentDocument(filePath);
    return { filePath, name: basename(filePath) };
  });

  ipcMain.handle('hwping:dialog-save', async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
    const result = await dialog.showSaveDialog(window, {
      defaultPath: options.suggestedName || 'document.hwp',
      filters: options.types?.length
        ? options.types.map((type) => ({ name: type.description, extensions: Object.values(type.accept).flatMap((items) => items.map((item) => item.replace(/^\./, ''))) }))
        : HWP_FILTERS,
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    const filePath = resolve(result.filePath);
    addRecentDocument(filePath);
    return { filePath, name: basename(filePath) };
  });

  ipcMain.handle('hwping:read-file', async (_event, filePath) => {
    return normalizeBytes(await readFile(resolve(filePath)));
  });

  ipcMain.handle('hwping:write-file', async (_event, payload) => {
    const filePath = resolve(payload.filePath);
    const bytes = normalizeBytes(payload.bytes);
    await writeFile(filePath, Buffer.from(bytes));
    addRecentDocument(filePath);
    return true;
  });

  ipcMain.on('hwping:renderer-ready', () => {
    rendererReady = true;
    flushPendingOpenPaths();
  });
}

async function main() {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  app.setName('Hwping');

  app.on('second-instance', (_event, argv) => {
    const extraDocs = argv.filter((arg) => /\.(hwp|hwpx)$/i.test(arg));
    for (const doc of extraDocs) {
      pendingOpenPaths.push(resolve(doc));
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    flushPendingOpenPaths();
  });

  app.on('open-file', (event, filePath) => {
    event.preventDefault();
    pendingOpenPaths.push(resolve(filePath));
    flushPendingOpenPaths();
  });

  setupIpc();
  queueStartupDocuments();

  await app.whenReady();
  await startRendererServer();
  await createWindow();
  refreshMenu();
  flushPendingOpenPaths();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
      refreshMenu();
      flushPendingOpenPaths();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

main().catch((error) => {
  console.error('[hwping-electron] failed to start', error);
  dialog.showErrorBox('Hwping Electron 시작 실패', String(error));
  app.quit();
});
