import { contextBridge, ipcRenderer } from "electron";

type RecordingState =
  | "Idle"
  | "Starting Recording"
  | "Recording"
  | "Stopping Recording"
  | "Processing"
  | "Completed"
  | "Error";

type RecordingStatePayload = {
  status: RecordingState;
  activeSince: number | null;
};

contextBridge.exposeInMainWorld("shuneLekha", {
  appName: "Shune-Lekha",
  stage: "Phase 5",
  shortcut: "Ctrl + Space",
  getRecordingState: () =>
    ipcRenderer.invoke("recording-state:get") as Promise<RecordingStatePayload>,
  cancelRecording: () => {
    ipcRenderer.send("recording:cancel");
  },
  onOpenSettings: (callback: () => void) => {
    const listener = () => {
      callback();
    };

    ipcRenderer.on("tray:settings", listener);

    return () => {
      ipcRenderer.removeListener("tray:settings", listener);
    };
  },
  onStateChange: (callback: (payload: RecordingStatePayload) => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      payload: RecordingStatePayload
    ) => {
      callback(payload);
    };

    ipcRenderer.on("app:state", listener);

    return () => {
      ipcRenderer.removeListener("app:state", listener);
    };
  },
  onShortcutError: (callback: (message: string) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, message: string) => {
      callback(message);
    };

    ipcRenderer.on("shortcut:error", listener);

    return () => {
      ipcRenderer.removeListener("shortcut:error", listener);
    };
  }
});
