import type { CommandDef } from '../types';
import { PageSetupDialog } from '@/ui/page-setup-dialog';
import { AboutDialog } from '@/ui/about-dialog';
import { showConfirm } from '@/ui/confirm-dialog';
import { showSaveAs } from '@/ui/save-as-dialog';

// File System Access API (Chrome/Edge)
declare global {
  interface Window {
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<FileSystemFileHandle>;
  }
}

export const fileCommands: CommandDef[] = [
  {
    id: 'file:new-doc',
    label: '새로 만들기',
    icon: 'icon-new-doc',
    shortcutLabel: 'Alt+N',
    canExecute: () => true,
    async execute(services) {
      const ctx = services.getContext();
      if (ctx.hasDocument) {
        const ok = await showConfirm(
          '새로 만들기',
          '현재 문서를 닫고 새 문서를 만드시겠습니까?\n저장하지 않은 내용은 사라집니다.',
        );
        if (!ok) return;
      }
      services.eventBus.emit('create-new-document');
    },
  },
  {
    id: 'file:open',
    label: '열기',
    execute() {
      document.getElementById('file-input')?.click();
    },
  },
  {
    id: 'file:save',
    label: '저장',
    icon: 'icon-save',
    shortcutLabel: 'Ctrl+S',
    canExecute: (ctx) => ctx.hasDocument,
    async execute(services) {
      try {
        const saveName = services.wasm.fileName;
        const bytes = services.wasm.exportHwp();
        const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/x-hwp' });

        // 1) File System Access API 지원 시 네이티브 저장 대화상자 사용
        if ('showSaveFilePicker' in window) {
          try {
            const handle = await window.showSaveFilePicker!({
              suggestedName: saveName,
              types: [{
                description: 'HWP 문서',
                accept: { 'application/x-hwp': ['.hwp'] },
              }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
            services.wasm.fileName = handle.name;
            console.log(`[file:save] ${handle.name} (${(bytes.length / 1024).toFixed(1)}KB)`);
            return;
          } catch (e) {
            // 사용자가 취소하면 AbortError 발생 — 무시
            if (e instanceof DOMException && e.name === 'AbortError') return;
            // 그 외 오류는 폴백으로 진행
            console.warn('[file:save] File System Access API 실패, 폴백:', e);
          }
        }

        // 2) 폴백: 새 문서인 경우 자체 파일이름 대화상자 표시
        let downloadName = saveName;
        if (services.wasm.isNewDocument) {
          const baseName = saveName.replace(/\.hwp$/i, '');
          const result = await showSaveAs(baseName);
          if (!result) return;
          downloadName = result;
          services.wasm.fileName = downloadName;
        }

        // 3) Blob 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        console.log(`[file:save] ${downloadName} (${(bytes.length / 1024).toFixed(1)}KB)`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[file:save] 저장 실패:', msg);
        alert(`파일 저장에 실패했습니다:\n${msg}`);
      }
    },
  },
  {
    id: 'file:page-setup',
    label: '편집 용지',
    icon: 'icon-page-setup',
    shortcutLabel: 'F7',
    canExecute: (ctx) => ctx.hasDocument,
    execute(services) {
      const dialog = new PageSetupDialog(services.wasm, services.eventBus, 0);
      dialog.show();
    },
  },
  {
    id: 'file:print',
    label: '인쇄',
    icon: 'icon-print',
    shortcutLabel: 'Ctrl+P',
    canExecute: () => false, // 미구현
    execute() { /* TODO */ },
  },
  {
    id: 'file:about',
    label: '제품 정보',
    icon: 'icon-help',
    execute() {
      new AboutDialog().show();
    },
  },
];
