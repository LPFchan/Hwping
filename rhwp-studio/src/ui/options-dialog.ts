/**
 * Preferences dialog.
 *
 * Tab structure: [Fonts] (future tabs like [Edit], [View], etc. can be added later)
 */
import { ModalDialog } from './dialog';
import { userSettings, type ThemeMode } from '@/core/user-settings';
import { FontSetDialog } from './font-set-dialog';
import { isLocalFontSupported, detectLocalFonts, getLocalFonts } from '@/core/local-fonts';
import { setThemeMode } from '@/core/theme';

export class OptionsDialog extends ModalDialog {
  private themeModeSelect!: HTMLSelectElement;
  private showRecentCheck!: HTMLInputElement;
  private recentCountInput!: HTMLInputElement;

  constructor() {
    super('Preferences', 480);
  }

  protected createBody(): HTMLElement {
    const body = document.createElement('div');
    body.className = 'opt-body';

    // Tab header
    const tabs = document.createElement('div');
    tabs.className = 'dialog-tabs';

    const fontTab = document.createElement('button');
    fontTab.className = 'dialog-tab active';
    fontTab.textContent = 'Fonts';
    fontTab.dataset.tab = 'font';
    tabs.appendChild(fontTab);

    body.appendChild(tabs);

    // Fonts tab panel
    const fontPanel = this.createFontPanel();
    fontPanel.className = 'dialog-tab-panel opt-tab-panel active';
    fontPanel.dataset.tab = 'font';
    body.appendChild(fontPanel);

    // Tab click handling (future-proof for more tabs)
    tabs.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.dialog-tab') as HTMLElement | null;
      if (!btn) return;
      const tabId = btn.dataset.tab;
      tabs.querySelectorAll('.dialog-tab').forEach(t => t.classList.remove('active'));
      body.querySelectorAll('.dialog-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = body.querySelector(`.dialog-tab-panel[data-tab="${tabId}"]`);
      panel?.classList.add('active');
    });

    return body;
  }

  private createFontPanel(): HTMLElement {
    const panel = document.createElement('div');
    const fs = userSettings.getFontSettings();
    const appearance = userSettings.getAppearanceSettings();

    // ── Appearance section ──
    const appearanceSection = document.createElement('div');
    appearanceSection.className = 'dialog-section';

    const appearanceTitle = document.createElement('div');
    appearanceTitle.className = 'dialog-section-title';
    appearanceTitle.textContent = 'Appearance';
    appearanceSection.appendChild(appearanceTitle);

    const appearanceRow = document.createElement('div');
    appearanceRow.className = 'dialog-row opt-row';

    const appearanceLabel = document.createElement('label');
    appearanceLabel.className = 'dialog-label opt-inline-label';
    appearanceLabel.htmlFor = 'opt-theme-mode';
    appearanceLabel.textContent = 'Theme';

    this.themeModeSelect = document.createElement('select');
    this.themeModeSelect.id = 'opt-theme-mode';
    this.themeModeSelect.className = 'dialog-select opt-theme-select';

    const themeOptions: Array<[value: string, label: string]> = [
      ['system', 'Use system setting'],
      ['light', 'Light'],
      ['dark', 'Dark'],
    ];
    for (const [value, label] of themeOptions) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      this.themeModeSelect.appendChild(option);
    }
    this.themeModeSelect.value = appearance.themeMode;

    appearanceRow.appendChild(appearanceLabel);
    appearanceRow.appendChild(this.themeModeSelect);
    appearanceSection.appendChild(appearanceRow);

    panel.appendChild(appearanceSection);

    // ── Font display section ──
    const viewSection = document.createElement('div');
    viewSection.className = 'dialog-section';

    const viewTitle = document.createElement('div');
    viewTitle.className = 'dialog-section-title';
    viewTitle.textContent = 'Font display';
    viewSection.appendChild(viewTitle);

    // Show recent fonts
    const recentRow = document.createElement('div');
    recentRow.className = 'dialog-row opt-row';

    this.showRecentCheck = document.createElement('input');
    this.showRecentCheck.type = 'checkbox';
    this.showRecentCheck.id = 'opt-show-recent';
    this.showRecentCheck.checked = fs.showRecentFonts;

    const recentLabel = document.createElement('label');
    recentLabel.htmlFor = 'opt-show-recent';
    recentLabel.textContent = 'Show recently used fonts';

    this.recentCountInput = document.createElement('input');
    this.recentCountInput.type = 'number';
    this.recentCountInput.className = 'dialog-input opt-count-input';
    this.recentCountInput.min = '1';
    this.recentCountInput.max = '5';
    this.recentCountInput.value = String(fs.recentFontCount);

    const countLabel = document.createElement('span');
    countLabel.className = 'opt-count-label';
    countLabel.textContent = 'fonts';

    recentRow.appendChild(this.showRecentCheck);
    recentRow.appendChild(recentLabel);
    recentRow.appendChild(this.recentCountInput);
    recentRow.appendChild(countLabel);
    viewSection.appendChild(recentRow);

    panel.appendChild(viewSection);

    // ── Representative font set section ──
    const fontSetSection = document.createElement('div');
    fontSetSection.className = 'dialog-section';

    const fontSetTitle = document.createElement('div');
    fontSetTitle.className = 'dialog-section-title';
    fontSetTitle.textContent = 'Representative font sets';
    fontSetSection.appendChild(fontSetTitle);

    const fontSetDesc = document.createElement('p');
    fontSetDesc.className = 'opt-desc';
    fontSetDesc.textContent = 'Representative font sets pair fonts by language so you can apply them in one step.';
    fontSetSection.appendChild(fontSetDesc);

    const fontSetBtn = document.createElement('button');
    fontSetBtn.className = 'dialog-btn opt-fontset-btn';
    fontSetBtn.textContent = 'Edit representative font sets';
    fontSetBtn.addEventListener('click', () => {
      const dlg = new FontSetDialog();
      dlg.show();
    });
    fontSetSection.appendChild(fontSetBtn);

    panel.appendChild(fontSetSection);

    // ── Local fonts section ──
    const localSection = document.createElement('div');
    localSection.className = 'dialog-section';

    const localTitle = document.createElement('div');
    localTitle.className = 'dialog-section-title';
    localTitle.textContent = 'Local fonts';
    localSection.appendChild(localTitle);

    const localDesc = document.createElement('p');
    localDesc.className = 'opt-desc';
    localDesc.textContent = 'Detect fonts installed on this computer and add them to the font list. (Chrome/Edge only)';
    localSection.appendChild(localDesc);

    const localRow = document.createElement('div');
    localRow.className = 'dialog-row opt-row';

    const localBtn = document.createElement('button');
    localBtn.className = 'dialog-btn opt-fontset-btn';
    localBtn.textContent = 'Detect local fonts';

    const localStatus = document.createElement('span');
    localStatus.className = 'opt-local-status';

    // Show status if fonts were already detected
    const cached = getLocalFonts();
    if (cached.length > 0) {
      localStatus.textContent = `${cached.length} local fonts detected`;
    }

    localBtn.addEventListener('click', async () => {
      if (!isLocalFontSupported()) {
        localStatus.textContent = 'This browser does not support local font detection.';
        return;
      }
      localBtn.disabled = true;
      localStatus.textContent = 'Detecting...';
      try {
        const fonts = await detectLocalFonts();
        localStatus.textContent = `${fonts.length} local fonts detected`;
      } catch {
        localStatus.textContent = 'Failed to detect fonts.';
      }
      localBtn.disabled = false;
    });

    localRow.appendChild(localBtn);
    localRow.appendChild(localStatus);
    localSection.appendChild(localRow);

    panel.appendChild(localSection);

    return panel;
  }

  protected onConfirm(): void {
    const count = Math.min(5, Math.max(1, parseInt(this.recentCountInput.value) || 3));
    const themeMode = this.themeModeSelect.value as ThemeMode;
    setThemeMode(themeMode);
    userSettings.updateFontSettings({
      showRecentFonts: this.showRecentCheck.checked,
      recentFontCount: count,
    });
  }
}
