export interface FileSystemWritableFileStreamLike {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
}

export interface FileSystemFileHandleLike {
  kind?: 'file';
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStreamLike>;
}

export interface ElectronFileDialogResult {
  filePath: string;
  name: string;
}

export interface ElectronOpenDocumentPayload extends ElectronFileDialogResult {
  bytes: Uint8Array | ArrayBuffer;
}

export interface ElectronMenuCatalogEntry {
  id: string;
  label: string;
  shortcutLabel?: string;
}

export interface ElectronMenuStateEntry {
  id: string;
  enabled: boolean;
}

export interface ElectronMenuCommandPayload {
  command: string;
  params?: Record<string, unknown>;
}

export interface ElectronDesktopBridge {
  openFileDialog?: (options?: {
    excludeAcceptAllOption?: boolean;
    multiple?: boolean;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<ElectronFileDialogResult | null>;
  saveFileDialog?: (options?: {
    suggestedName?: string;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<ElectronFileDialogResult | null>;
  readFile?: (filePath: string) => Promise<Uint8Array | ArrayBuffer>;
  writeFile?: (filePath: string, data: Uint8Array) => Promise<void>;
  onMenuCommand?: (listener: (payload: string | ElectronMenuCommandPayload) => void) => () => void;
  onOpenDocument?: (listener: (payload: ElectronOpenDocumentPayload) => void) => () => void;
  syncMenuCatalog?: (catalog: ElectronMenuCatalogEntry[]) => void;
  syncMenuState?: (state: ElectronMenuStateEntry[]) => void;
  ready?: () => void;
}

export interface FileSystemWindowLike {
  showOpenFilePicker?: (options?: {
    excludeAcceptAllOption?: boolean;
    multiple?: boolean;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<FileSystemFileHandleLike[]>;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<FileSystemFileHandleLike>;
  hwpingDesktop?: ElectronDesktopBridge;
}

declare global {
  interface Window {
    hwpingDesktop?: ElectronDesktopBridge;
  }
}

export interface FileHandleReadResult {
  name: string;
  bytes: Uint8Array;
}

export interface SaveDocumentOptions {
  blob: Blob;
  suggestedName: string;
  currentHandle: FileSystemFileHandleLike | null;
  windowLike: FileSystemWindowLike;
}

export interface SaveDocumentResult {
  method: 'current-handle' | 'save-picker' | 'fallback';
  handle: FileSystemFileHandleLike | null;
  fileName: string;
}

const HWP_PICKER_TYPES = [{
  description: 'HWP 문서',
  accept: { 'application/x-hwp': ['.hwp', '.hwpx'] },
}];

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function getFileType(fileName: string): string {
  return fileName.toLowerCase().endsWith('.hwpx') ? 'application/hwp+zip' : 'application/x-hwp';
}

async function writeBlobToHandle(handle: FileSystemFileHandleLike, blob: Blob): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

function normalizeBytes(bytes: Uint8Array | ArrayBuffer): Uint8Array {
  return bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
}

export function createElectronFileHandle(
  windowLike: FileSystemWindowLike,
  descriptor: ElectronFileDialogResult,
): FileSystemFileHandleLike {
  const desktop = windowLike.hwpingDesktop;
  if (!desktop?.readFile || !desktop?.writeFile) {
    throw new Error('Electron desktop bridge is not available');
  }

  const filePath = descriptor.filePath;
  const fileName = descriptor.name;

  return {
    kind: 'file',
    name: fileName,
    async getFile() {
      const bytes = normalizeBytes(await desktop.readFile!(filePath));
      return new File([bytes], fileName, { type: getFileType(fileName) });
    },
    async createWritable() {
      let pendingBlob: Blob | null = null;
      return {
        async write(data: Blob) {
          pendingBlob = data;
        },
        async close() {
          if (!pendingBlob) return;
          const bytes = new Uint8Array(await pendingBlob.arrayBuffer());
          await desktop.writeFile!(filePath, bytes);
        },
      };
    },
  };
}

export async function pickOpenFileHandle(windowLike: FileSystemWindowLike): Promise<FileSystemFileHandleLike | null> {
  if (windowLike.hwpingDesktop?.openFileDialog) {
    try {
      const result = await windowLike.hwpingDesktop.openFileDialog({
        excludeAcceptAllOption: true,
        multiple: false,
        types: HWP_PICKER_TYPES,
      });
      return result ? createElectronFileHandle(windowLike, result) : null;
    } catch (error) {
      if (isAbortError(error)) return null;
      throw error;
    }
  }

  if (windowLike.showOpenFilePicker) {
    try {
      const handles = await windowLike.showOpenFilePicker({
        excludeAcceptAllOption: true,
        multiple: false,
        types: HWP_PICKER_TYPES,
      });
      return handles[0] ?? null;
    } catch (error) {
      if (isAbortError(error)) return null;
      throw error;
    }
  }

  return null;
}

export async function readFileFromHandle(handle: FileSystemFileHandleLike): Promise<FileHandleReadResult> {
  const file = await handle.getFile();
  return {
    name: file.name,
    bytes: new Uint8Array(await file.arrayBuffer()),
  };
}

export async function saveDocumentToFileSystem(options: SaveDocumentOptions): Promise<SaveDocumentResult> {
  const { blob, suggestedName, currentHandle, windowLike } = options;

  if (currentHandle) {
    await writeBlobToHandle(currentHandle, blob);
    return {
      method: 'current-handle',
      handle: currentHandle,
      fileName: currentHandle.name,
    };
  }

  if (windowLike.hwpingDesktop?.saveFileDialog) {
    const result = await windowLike.hwpingDesktop.saveFileDialog({
      suggestedName,
      types: HWP_PICKER_TYPES,
    });

    if (!result) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const handle = createElectronFileHandle(windowLike, result);
    await writeBlobToHandle(handle, blob);
    return {
      method: 'save-picker',
      handle,
      fileName: result.name,
    };
  }

  if (windowLike.showSaveFilePicker) {
    const handle = await windowLike.showSaveFilePicker({
      suggestedName,
      types: HWP_PICKER_TYPES,
    });
    await writeBlobToHandle(handle, blob);
    return {
      method: 'save-picker',
      handle,
      fileName: handle.name,
    };
  }

  return {
    method: 'fallback',
    handle: null,
    fileName: suggestedName,
  };
}
