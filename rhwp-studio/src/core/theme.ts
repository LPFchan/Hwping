import { userSettings, type ThemeMode } from './user-settings';

const THEME_ATTR = 'data-theme';
const THEME_MODE_ATTR = 'data-theme-mode';
const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';
const VALID_THEME_MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];

let currentThemeMode: ThemeMode = normalizeThemeMode(userSettings.getAppearanceSettings().themeMode);
let mediaQueryList: MediaQueryList | null = null;
let mediaListenerAttached = false;
let storageListenerAttached = false;

function normalizeThemeMode(value: unknown): ThemeMode {
  return typeof value === 'string' && VALID_THEME_MODES.includes(value as ThemeMode)
    ? value as ThemeMode
    : 'system';
}

function ensureMediaQueryList(): MediaQueryList {
  if (!mediaQueryList) {
    mediaQueryList = window.matchMedia(SYSTEM_DARK_QUERY);
  }
  return mediaQueryList;
}

function resolveEffectiveTheme(themeMode: ThemeMode): 'light' | 'dark' {
  if (themeMode === 'light' || themeMode === 'dark') return themeMode;
  return ensureMediaQueryList().matches ? 'dark' : 'light';
}

function applyThemeToDom(themeMode: ThemeMode): void {
  currentThemeMode = themeMode;
  const effectiveTheme = resolveEffectiveTheme(themeMode);
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, effectiveTheme);
  root.setAttribute(THEME_MODE_ATTR, themeMode);
  root.style.colorScheme = effectiveTheme;
}

function handleSystemThemeChanged(): void {
  if (currentThemeMode === 'system') {
    applyThemeToDom(currentThemeMode);
  }
}

function ensureSystemThemeListener(): void {
  if (mediaListenerAttached) return;
  const query = ensureMediaQueryList();
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handleSystemThemeChanged);
  } else {
    query.addListener(handleSystemThemeChanged);
  }
  mediaListenerAttached = true;
}

function hasChromeSyncStorage(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.sync);
}

function readThemeModeFromChromeStorage(): Promise<ThemeMode | null> {
  if (!hasChromeSyncStorage()) return Promise.resolve(null);

  return new Promise((resolve) => {
    chrome.storage.sync.get('themeMode', (result) => {
      if (chrome.runtime?.lastError) {
        resolve(null);
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(result, 'themeMode')) {
        resolve(null);
        return;
      }
      resolve(normalizeThemeMode(result.themeMode));
    });
  });
}

function writeThemeModeToChromeStorage(themeMode: ThemeMode): Promise<void> {
  if (!hasChromeSyncStorage()) return Promise.resolve();

  return new Promise((resolve) => {
    chrome.storage.sync.set({ themeMode }, () => {
      resolve();
    });
  });
}

function ensureChromeStorageThemeListener(): void {
  if (!hasChromeSyncStorage() || storageListenerAttached) return;

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (!changes.themeMode) return;

    const nextThemeMode = normalizeThemeMode(changes.themeMode.newValue);
    if (nextThemeMode === currentThemeMode) return;

    userSettings.updateAppearanceSettings({ themeMode: nextThemeMode });
    applyThemeToDom(nextThemeMode);
  });

  storageListenerAttached = true;
}

export async function initializeThemePreference(): Promise<void> {
  ensureSystemThemeListener();

  const localThemeMode = normalizeThemeMode(userSettings.getAppearanceSettings().themeMode);
  applyThemeToDom(localThemeMode);

  const storedThemeMode = await readThemeModeFromChromeStorage();
  if (storedThemeMode) {
    if (storedThemeMode !== localThemeMode) {
      userSettings.updateAppearanceSettings({ themeMode: storedThemeMode });
      applyThemeToDom(storedThemeMode);
    }
  } else {
    await writeThemeModeToChromeStorage(localThemeMode);
  }

  ensureChromeStorageThemeListener();
}

export function setThemeMode(themeMode: ThemeMode): void {
  const normalized = normalizeThemeMode(themeMode);
  userSettings.updateAppearanceSettings({ themeMode: normalized });
  applyThemeToDom(normalized);
  void writeThemeModeToChromeStorage(normalized);
}

export function getThemeMode(): ThemeMode {
  return currentThemeMode;
}
