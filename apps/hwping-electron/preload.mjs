import { contextBridge, ipcRenderer } from 'electron';

function isAbortPayload(payload) {
  return payload && typeof payload === 'object' && payload.canceled === true;
}

contextBridge.exposeInMainWorld('hwpingDesktop', {
  openFileDialog: async (options) => {
    const result = await ipcRenderer.invoke('hwping:dialog-open', options);
    return result ?? null;
  },
  saveFileDialog: async (options) => {
    const result = await ipcRenderer.invoke('hwping:dialog-save', options);
    if (isAbortPayload(result)) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }
    return result ?? null;
  },
  readFile: async (filePath) => ipcRenderer.invoke('hwping:read-file', filePath),
  writeFile: async (filePath, bytes) => ipcRenderer.invoke('hwping:write-file', { filePath, bytes }),
  ready: () => ipcRenderer.send('hwping:renderer-ready'),
  onMenuCommand: (listener) => {
    const channel = 'hwping:menu-command';
    const handler = (_event, command) => listener(command);
    ipcRenderer.on(channel, handler);
  },
  onOpenDocument: (listener) => {
    const channel = 'hwping:open-document';
    const handler = (_event, payload) => listener(payload);
    ipcRenderer.on(channel, handler);
  },
});
