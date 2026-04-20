/**
 * About / license dialog.
 *
 * Includes the required notice for the public HWP specification documents
 * and lists the open-source licenses of the external crates used here.
 */
import { ModalDialog } from './dialog';

/** 외부 크레이트 라이선스 정보 */
const THIRD_PARTY_LICENSES = [
  { name: 'wasm-bindgen', license: 'MIT / Apache-2.0' },
  { name: 'web-sys', license: 'MIT / Apache-2.0' },
  { name: 'js-sys', license: 'MIT / Apache-2.0' },
  { name: 'cfb', license: 'MIT' },
  { name: 'flate2', license: 'MIT / Apache-2.0' },
  { name: 'byteorder', license: 'MIT / Unlicense' },
  { name: 'base64', license: 'MIT / Apache-2.0' },
  { name: 'console_error_panic_hook', license: 'MIT / Apache-2.0' },
];

export class AboutDialog extends ModalDialog {
  constructor() {
    super('About Hwping', 460);
  }

  protected createBody(): HTMLElement {
    const body = document.createElement('div');
    body.className = 'about-body';

    // Product name
    const titleEn = document.createElement('div');
    titleEn.className = 'about-product-name';
    titleEn.textContent = 'Hwping';
    body.appendChild(titleEn);

    // Short description
    const titleKo = document.createElement('div');
    titleKo.className = 'about-product-name-ko';
    titleKo.textContent = 'Open-source HWP editor';
    body.appendChild(titleKo);

    // Version
    const version = document.createElement('div');
    version.className = 'about-version';
    version.textContent = `Version ${__APP_VERSION__}`;
    body.appendChild(version);

    // Tech stack
    const tech = document.createElement('div');
    tech.className = 'about-tech';
    tech.textContent = 'Built with Rust, WebAssembly, and TypeScript';
    body.appendChild(tech);

    // Required HWP spec notice
    const notice = document.createElement('div');
    notice.className = 'about-notice';
    notice.textContent =
      'This product was developed with reference to Hancom\'s public HWP specification documents (.hwp).';
    body.appendChild(notice);

    // Open source licenses
    const licenseTitle = document.createElement('div');
    licenseTitle.className = 'about-license-title';
    licenseTitle.textContent = 'Open Source Licenses';
    body.appendChild(licenseTitle);

    const licenseTable = document.createElement('table');
    licenseTable.className = 'about-license-table';
    for (const lib of THIRD_PARTY_LICENSES) {
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = lib.name;
      const tdLicense = document.createElement('td');
      tdLicense.textContent = lib.license;
      tr.appendChild(tdName);
      tr.appendChild(tdLicense);
      licenseTable.appendChild(tr);
    }
    body.appendChild(licenseTable);

    // Copyright
    const copyright = document.createElement('div');
    copyright.className = 'about-copyright';
    copyright.textContent = '\u00A9 2026 rhwp: Edward Kim';
    body.appendChild(copyright);

    return body;
  }

  protected onConfirm(): void {
    // 정보 표시 전용 — 확인 동작 없음
  }

  override show(): void {
    super.show();
    // footer를 "닫기" 버튼 하나로 교체
    const footer = this.dialog.querySelector('.dialog-footer');
    if (footer) {
      footer.innerHTML = '';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'dialog-btn dialog-btn-primary';
      closeBtn.textContent = 'Close';
      closeBtn.addEventListener('click', () => this.hide());
      footer.appendChild(closeBtn);
    }
  }
}
