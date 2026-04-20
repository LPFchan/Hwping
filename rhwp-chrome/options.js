(function () {
  'use strict';

  const VALID_THEME_MODES = ['system', 'light', 'dark'];

  function normalizeThemeMode(value) {
    return VALID_THEME_MODES.includes(value) ? value : 'system';
  }

  function resolveEffectiveTheme(themeMode) {
    const normalized = normalizeThemeMode(themeMode);
    if (normalized === 'dark') return 'dark';
    if (normalized === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(themeMode) {
    const effectiveTheme = resolveEffectiveTheme(themeMode);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.style.colorScheme = effectiveTheme;
  }

  // i18n 적용
  document.getElementById('title').textContent = chrome.i18n.getMessage('optionsTitle');
  document.getElementById('labelThemeMode').textContent = chrome.i18n.getMessage('optionsTheme');
  document.getElementById('themeOptionSystem').textContent = chrome.i18n.getMessage('optionsThemeSystem');
  document.getElementById('themeOptionLight').textContent = chrome.i18n.getMessage('optionsThemeLight');
  document.getElementById('themeOptionDark').textContent = chrome.i18n.getMessage('optionsThemeDark');
  document.getElementById('labelAutoOpen').textContent = chrome.i18n.getMessage('optionsAutoOpen');
  document.getElementById('labelShowBadges').textContent = chrome.i18n.getMessage('optionsShowBadges');
  document.getElementById('labelHoverPreview').textContent = chrome.i18n.getMessage('optionsHoverPreview');
  document.getElementById('saved').textContent = chrome.i18n.getMessage('optionsSaved');
  document.getElementById('privacy').textContent = chrome.i18n.getMessage('optionsPrivacy');
  document.getElementById('version').textContent = chrome.runtime.getManifest().version;

  const checkboxInputs = ['autoOpen', 'showBadges', 'hoverPreview'];
  const themeModeSelect = document.getElementById('themeMode');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // 설정 로드
  chrome.storage.sync.get(
    { autoOpen: true, showBadges: true, hoverPreview: true, themeMode: 'system' },
    (settings) => {
      for (const id of checkboxInputs) {
        document.getElementById(id).checked = settings[id];
      }
      const themeMode = normalizeThemeMode(settings.themeMode);
      themeModeSelect.value = themeMode;
      applyTheme(themeMode);
    }
  );

  function saveSettings() {
    const settings = { themeMode: normalizeThemeMode(themeModeSelect.value) };
    for (const id of checkboxInputs) {
      settings[id] = document.getElementById(id).checked;
    }
    chrome.storage.sync.set(settings, () => {
      applyTheme(settings.themeMode);
      const saved = document.getElementById('saved');
      saved.classList.add('show');
      setTimeout(() => saved.classList.remove('show'), 1500);
    });
  }

  // 설정 저장
  for (const id of checkboxInputs) {
    document.getElementById(id).addEventListener('change', saveSettings);
  }
  themeModeSelect.addEventListener('change', saveSettings);

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', () => {
      if (normalizeThemeMode(themeModeSelect.value) === 'system') {
        applyTheme('system');
      }
    });
  } else {
    mediaQuery.addListener(() => {
      if (normalizeThemeMode(themeModeSelect.value) === 'system') {
        applyTheme('system');
      }
    });
  }
})();
