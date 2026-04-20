import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import { createServer } from 'node:http';
import { appendFileSync } from 'node:fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { desktopAppMenuItems, desktopMenuGroups } from './menu-model.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RENDERER_ROOT = resolve(__dirname, 'dist', 'renderer');
const HWP_FILTERS = [{ name: 'HWP 문서', extensions: ['hwp', 'hwpx'] }];
const MAX_RECENTS = 8;

let mainWindow = null;
let rendererReady = false;
let rendererPort = 0;
let rendererServer = null;
const pendingOpenPaths = [];
const pendingRendererMenuCommands = [];
const recentDocuments = [];
const commandCatalog = new Map();
const commandState = new Map();
const launchLogPath = process.env.HWPING_LAUNCH_LOG?.trim() || '';

function traceLaunch(stage, details = '') {
  if (!launchLogPath) return;
  const suffix = details ? ` ${details}` : '';
  try {
    appendFileSync(launchLogPath, `${new Date().toISOString()} [${stage}]${suffix}\n`, 'utf8');
  } catch {
    // Logging is best-effort and must never block app startup.
  }
}

traceLaunch('boot', `argv=${JSON.stringify(process.argv)} cwd=${process.cwd()} execPath=${process.execPath} resourcesPath=${process.resourcesPath}`);

process.on('uncaughtException', (error) => {
  traceLaunch('uncaughtException', String(error?.stack || error));
});

process.on('unhandledRejection', (error) => {
  traceLaunch('unhandledRejection', String(error?.stack || error));
});

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

function getCatalogEntry(commandId) {
  return commandCatalog.get(commandId) ?? null;
}

function getCommandLabel(commandId) {
  return getCatalogEntry(commandId)?.label ?? commandId;
}

function getCommandShortcutLabel(commandId) {
  return getCatalogEntry(commandId)?.shortcutLabel ?? null;
}

function isCommandEnabled(commandId) {
  if (!commandState.has(commandId)) return true;
  return Boolean(commandState.get(commandId));
}

function buildCommandMenuItem(commandId, extras = {}) {
  const {
    commandId: _ignoredCommandId,
    items: _ignoredItems,
    type: _ignoredType,
    transport: _ignoredTransport,
    params,
    label: explicitLabel,
    ...menuExtras
  } = extras;
  const catalogEntry = getCatalogEntry(commandId);
  const isRegisteredCommand = Boolean(catalogEntry) || _ignoredTransport === 'main';
  const shortcutLabel = getCommandShortcutLabel(commandId);
  const baseLabel = explicitLabel ?? getCommandLabel(commandId);
  const item = {
    label: !menuExtras.accelerator && shortcutLabel
      ? `${baseLabel}\t${shortcutLabel}`
      : baseLabel,
    enabled: isRegisteredCommand
      ? (_ignoredTransport === 'main' ? true : isCommandEnabled(commandId))
      : false,
    click: () => handleMenuCommand(commandId, params, _ignoredTransport),
    ...menuExtras,
  };
  if (menuExtras.accelerator) {
    item.accelerator = menuExtras.accelerator;
  }
  return item;
}

async function handleMainMenuCommand(commandId, params = {}) {
  traceLaunch('menu:main', `${commandId} params=${JSON.stringify(params)}`);
  if (commandId === 'file:open') {
    const window = mainWindow ?? BrowserWindow.getFocusedWindow() ?? undefined;
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: HWP_FILTERS,
    });
    if (result.canceled || result.filePaths.length === 0) {
      return;
    }
    await openPathInRenderer(result.filePaths[0]);
    showMainWindow();
    return;
  }

  if (commandId === 'file:about') {
    await dialog.showMessageBox(mainWindow ?? undefined, {
      type: 'info',
      title: 'Hwping',
      message: 'Hwping',
      detail: `Hwping ${app.getVersion()}`,
    });
    return;
  }

  sendMenuCommand(commandId, params);
}

function handleMenuCommand(commandId, params = {}, transport = 'renderer') {
  traceLaunch('menu:click', `${commandId} transport=${transport} params=${JSON.stringify(params)}`);
  if (transport === 'main') {
    void handleMainMenuCommand(commandId, params);
    return;
  }
  sendMenuCommand(commandId, params);
}

function buildAppMenuTemplate() {
  return {
    label: app.getName(),
    submenu: desktopAppMenuItems.map((item) => {
      if (item.type === 'separator') return { type: 'separator' };
      if (item.role) return { role: item.role };
      if (item.commandId) return buildCommandMenuItem(item.commandId, item);
      return { type: 'separator' };
    }),
  };
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

function isMenuNodeEnabled(item) {
  if (!item) return false;
  if (item.type === 'separator') return true;
  if (item.type === 'recent') return recentDocuments.length > 0;
  if (item.role) return true;
  if (item.items) return item.items.some((child) => isMenuNodeEnabled(child));
  if (item.commandId) return Boolean(getCatalogEntry(item.commandId)) && isCommandEnabled(item.commandId);
  return true;
}

function buildNestedMenuItems(items) {
  return items.map((item) => {
    if (item.type === 'separator') {
      return { type: 'separator' };
    }
    if (item.type === 'recent') {
      return { label: '최근 문서', submenu: buildRecentDocumentsSubmenu() };
    }
    if (item.role) {
      return { role: item.role };
    }
    if (item.items) {
      return {
        label: item.label,
        enabled: isMenuNodeEnabled(item),
        submenu: buildNestedMenuItems(item.items),
      };
    }
    return buildCommandMenuItem(item.commandId, item);
  });
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
  const template = [buildAppMenuTemplate()];
  for (const group of desktopMenuGroups) {
    template.push({
      label: group.label,
      submenu: buildNestedMenuItems(group.items),
    });
  }
  return template;
}

function refreshMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenuTemplate()));
}

function sendMenuCommand(command, params = {}) {
  if (!rendererReady || !mainWindow || mainWindow.isDestroyed()) {
    pendingRendererMenuCommands.push({ command, params });
    traceLaunch('menu:queued', `${command} params=${JSON.stringify(params)}`);
    return;
  }
  traceLaunch('menu:renderer', `${command} params=${JSON.stringify(params)}`);
  mainWindow.webContents.send('hwping:menu-command', { command, params });
}

function flushPendingRendererMenuCommands() {
  if (!rendererReady || !mainWindow || mainWindow.isDestroyed()) return;
  while (pendingRendererMenuCommands.length > 0) {
    const item = pendingRendererMenuCommands.shift();
    if (!item) continue;
    traceLaunch('menu:renderer', `${item.command} params=${JSON.stringify(item.params)}`);
    mainWindow.webContents.send('hwping:menu-command', item);
  }
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
  traceLaunch('createWindow:start');
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
    traceLaunch('createWindow:closed');
    mainWindow = null;
  });
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    traceLaunch('render-process-gone', JSON.stringify(details));
  });

  await mainWindow.loadURL(`http://127.0.0.1:${rendererPort}/`);
  traceLaunch('createWindow:loaded', `url=http://127.0.0.1:${rendererPort}/`);
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

  ipcMain.on('hwping:menu-catalog', (_event, catalog = []) => {
    commandCatalog.clear();
    for (const entry of catalog) {
      if (!entry?.id) continue;
      commandCatalog.set(entry.id, entry);
    }
    refreshMenu();
  });

  ipcMain.on('hwping:menu-state', (_event, state = []) => {
    commandState.clear();
    for (const entry of state) {
      if (!entry?.id) continue;
      commandState.set(entry.id, Boolean(entry.enabled));
    }
    refreshMenu();
  });

  ipcMain.on('hwping:renderer-ready', () => {
    rendererReady = true;
    flushPendingOpenPaths();
    flushPendingRendererMenuCommands();
  });
}

async function main() {
  traceLaunch('main:start');
  if (!app.requestSingleInstanceLock()) {
    traceLaunch('main:single-instance-lock', 'denied');
    app.quit();
    return;
  }
  traceLaunch('main:single-instance-lock', 'granted');

  app.setName('Hwping');

  app.on('second-instance', (_event, argv) => {
    traceLaunch('app:second-instance', `argv=${JSON.stringify(argv)}`);
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
    traceLaunch('app:open-file', `filePath=${filePath}`);
    event.preventDefault();
    pendingOpenPaths.push(resolve(filePath));
    flushPendingOpenPaths();
  });

  setupIpc();
  queueStartupDocuments();
  traceLaunch('main:startup-documents', `count=${pendingOpenPaths.length}`);

  app.on('before-quit', () => {
    traceLaunch('app:before-quit');
  });

  app.on('will-quit', () => {
    traceLaunch('app:will-quit');
  });

  await app.whenReady();
  traceLaunch('app:ready');
  await startRendererServer();
  traceLaunch('renderer:server-started', `port=${rendererPort}`);
  await createWindow();
  refreshMenu();
  flushPendingOpenPaths();

  app.on('activate', async () => {
    traceLaunch('app:activate', `windows=${BrowserWindow.getAllWindows().length}`);
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
      refreshMenu();
      flushPendingOpenPaths();
    }
  });

  app.on('window-all-closed', () => {
    traceLaunch('app:window-all-closed', `platform=${process.platform}`);
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
