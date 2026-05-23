import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
  session,
  Tray,
  nativeImage
} from "electron";
import path from "node:path";

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

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false;
let currentStatus: RecordingState = "Idle";
let currentShortcutError: string | null = null;
let stateTimer: NodeJS.Timeout | null = null;
let recordingState: RecordingState = "Idle";
let activeSince: number | null = null;

const DEFAULT_SHORTCUT = "CommandOrControl+Space";
const START_RECORDING_DELAY_MS = 350;
const STOP_RECORDING_DELAY_MS = 300;
const PROCESSING_DELAY_MS = 650;
const COMPLETED_DELAY_MS = 900;

function updateTrayTooltip(status: string): void {
  tray?.setToolTip(`Shune-Lekha\n${status}`);
}

function showMainWindow(): void {
  if (!mainWindow) {
    createMainWindow();
    return;
  }

  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

function sendRendererEvent(channel: string): void {
  mainWindow?.webContents.send(channel);
}

function getRecordingStatePayload(): RecordingStatePayload {
  return {
    status: recordingState,
    activeSince
  };
}

function sendStateUpdate(): void {
  const payload = getRecordingStatePayload();
  currentStatus = payload.status;
  updateTrayTooltip(payload.status);
  mainWindow?.webContents.send("app:state", payload);
  overlayWindow?.webContents.send("app:state", payload);
}

function sendShortcutError(message: string): void {
  currentShortcutError = message;
  mainWindow?.webContents.send("shortcut:error", message);
}

function clearStateTimer(): void {
  if (stateTimer) {
    clearTimeout(stateTimer);
    stateTimer = null;
  }
}

function setRecordingState(state: RecordingState): void {
  if (state === "Starting Recording" && activeSince === null) {
    activeSince = Date.now();
  }

  if (state === "Idle" || state === "Error") {
    activeSince = null;
  }

  recordingState = state;
  sendStateUpdate();
  syncOverlayVisibility();
}

function queueNextState(
  delayMs: number,
  nextState: RecordingState,
  afterSet?: () => void
): void {
  clearStateTimer();
  stateTimer = setTimeout(() => {
    stateTimer = null;
    setRecordingState(nextState);
    afterSet?.();
  }, delayMs);
}

function beginFakeRecordingFlow(): void {
  setRecordingState("Starting Recording");
  queueNextState(START_RECORDING_DELAY_MS, "Recording");
}

function finishFakeRecordingFlow(): void {
  setRecordingState("Stopping Recording");
  queueNextState(STOP_RECORDING_DELAY_MS, "Processing", () => {
    queueNextState(PROCESSING_DELAY_MS, "Completed", () => {
      queueNextState(COMPLETED_DELAY_MS, "Idle");
    });
  });
}

function handleShortcutPress(): void {
  if (recordingState === "Idle" || recordingState === "Completed") {
    beginFakeRecordingFlow();
    return;
  }

  if (recordingState === "Recording") {
    finishFakeRecordingFlow();
  }
}

function cancelFakeRecordingFlow(): void {
  clearStateTimer();
  setRecordingState("Idle");
}

function registerGlobalShortcut(): void {
  globalShortcut.unregisterAll();

  const registered = globalShortcut.register(DEFAULT_SHORTCUT, () => {
    handleShortcutPress();
  });

  if (!registered) {
    sendShortcutError(
      "This shortcut is already used by another app. Please choose another shortcut."
    );
    setRecordingState("Error");
    return;
  }

  currentShortcutError = null;
  setRecordingState("Idle");
}

function createTrayIcon(): Tray {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="9" fill="#1f4f46" />
      <path d="M11 10.25a5 5 0 0 1 10 0v5.5a5 5 0 0 1-10 0v-5.5Z" fill="#f3efe6" />
      <path d="M16 22.5v4" stroke="#f3efe6" stroke-width="2.2" stroke-linecap="round" />
      <path d="M9 15.75a7 7 0 0 0 14 0" stroke="#f3efe6" stroke-width="2.2" stroke-linecap="round" fill="none" />
    </svg>
  `.trim();
  const icon = nativeImage.createFromDataURL(
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  );
  return new Tray(icon.resize({ width: 16, height: 16 }));
}

function createTray(): void {
  tray = createTrayIcon();
  updateTrayTooltip("Idle");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open Local Flow",
        click: () => {
          showMainWindow();
        }
      },
      {
        label: "Settings",
        click: () => {
          showMainWindow();
          sendRendererEvent("tray:settings");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ])
  );
  tray.on("click", () => {
    showMainWindow();
  });
}

function createOverlayWindow(): void {
  const primaryDisplay = screen.getPrimaryDisplay();
  const overlayWidth = 220;
  const overlayHeight = 88;
  const overlayX =
    primaryDisplay.workArea.x +
    Math.round((primaryDisplay.workAreaSize.width - overlayWidth) / 2);
  const overlayY =
    primaryDisplay.workArea.y + primaryDisplay.workAreaSize.height - overlayHeight - 36;

  overlayWindow = new BrowserWindow({
    width: overlayWidth,
    height: overlayHeight,
    x: overlayX,
    y: overlayY,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const overlayHtmlPath = path.join(
    __dirname,
    "..",
    "app",
    "electron",
    "renderer",
    "overlay.html"
  );

  void overlayWindow.loadFile(overlayHtmlPath);
  overlayWindow.setAlwaysOnTop(true, "screen-saver");

  overlayWindow.on("closed", () => {
    overlayWindow = null;
  });

  overlayWindow.webContents.on("did-finish-load", () => {
    overlayWindow?.webContents.send("app:state", getRecordingStatePayload());
  });
}

function syncOverlayVisibility(): void {
  if (!overlayWindow) {
    return;
  }

  const shouldShow = !["Idle", "Error"].includes(recordingState);

  if (shouldShow) {
    overlayWindow.showInactive();
    return;
  }

  overlayWindow.hide();
}

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: "#f4efe7",
    title: "Shune-Lekha",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererHtmlPath = path.join(
    __dirname,
    "..",
    "app",
    "electron",
    "renderer",
    "index.html"
  );

  void mainWindow.loadFile(rendererHtmlPath);

  mainWindow.webContents.on("did-finish-load", () => {
    sendStateUpdate();

    if (currentShortcutError) {
      sendShortcutError(currentShortcutError);
    }
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      callback(permission === "media");
    }
  );
  createMainWindow();
  createOverlayWindow();
  createTray();
  registerGlobalShortcut();
  ipcMain.handle("recording-state:get", () => getRecordingStatePayload());
  ipcMain.on("recording:cancel", () => {
    cancelFakeRecordingFlow();
  });

  app.on("activate", () => {
    if (!mainWindow) {
      createMainWindow();
      return;
    }

    showMainWindow();
  });
});

app.on("before-quit", () => {
  isQuitting = true;
  clearStateTimer();
  ipcMain.removeHandler("recording-state:get");
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Keep the app alive in the tray for Phase 1 behavior.
  }
});
