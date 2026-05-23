import React, { useEffect, useRef, useState } from "react";

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

type MicrophoneOption = {
  deviceId: string;
  label: string;
};

declare global {
  interface Window {
    shuneLekha?: {
      appName: string;
      stage: string;
      shortcut?: string;
      getRecordingState?: () => Promise<RecordingStatePayload>;
      cancelRecording?: () => void;
      onOpenSettings?: (callback: () => void) => () => void;
      onStateChange?: (
        callback: (payload: RecordingStatePayload) => void
      ) => () => void;
      onShortcutError?: (callback: (message: string) => void) => () => void;
    };
  }
}

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  margin: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at top left, #fff9f0 0%, #fff9f0 15%, transparent 50%), linear-gradient(135deg, #f4efe7 0%, #e4efe8 100%)",
  color: "#1f2933",
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  padding: "32px"
};

const cardStyle: React.CSSProperties = {
  width: "min(860px, 100%)",
  padding: "48px",
  borderRadius: "28px",
  background: "rgba(255, 255, 255, 0.92)",
  border: "1px solid rgba(160, 174, 192, 0.28)",
  boxShadow: "0 28px 80px rgba(31, 41, 51, 0.12)"
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  borderRadius: "999px",
  backgroundColor: "#e8f7ee",
  color: "#18794e",
  fontSize: "0.95rem",
  fontWeight: 600
};

const sectionStyle: React.CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "22px",
  background: "linear-gradient(180deg, rgba(249, 250, 251, 0.95) 0%, rgba(243, 244, 246, 0.95) 100%)",
  border: "1px solid rgba(209, 213, 219, 0.7)"
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "10px",
  fontSize: "0.95rem",
  color: "#364152"
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.45)",
  background: "#ffffff",
  color: "#1f2933",
  fontSize: "1rem"
};

const actionButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  background: "linear-gradient(135deg, #1f4f46, #274c77)",
  color: "#f8fafc",
  cursor: "pointer",
  fontSize: "0.95rem",
  fontWeight: 600
};

const subtleButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  background: "#e5eef8",
  color: "#274c77"
};

const stateDescriptions: Record<RecordingState, string> = {
  Idle: "Ready for the next shortcut press.",
  "Starting Recording": "Preparing the fake recording overlay and state transition.",
  Recording: "Fake recording is active. Press the shortcut again to stop the fake capture flow.",
  "Stopping Recording": "Fake recording is stopping.",
  Processing: "Processing the fake recording result.",
  Completed: "The fake recording cycle completed successfully.",
  Error: "A recoverable setup error occurred."
};

const activeStates = new Set<RecordingState>([
  "Starting Recording",
  "Recording",
  "Stopping Recording",
  "Processing",
  "Completed"
]);

const selectedMicrophoneStorageKey = "shune-lekha.selected-microphone";

function formatDuration(activeSince: number | null): string {
  if (!activeSince) {
    return "00:00";
  }

  const elapsedMs = Math.max(0, Date.now() - activeSince);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function readSavedMicrophoneId(): string {
  return window.localStorage.getItem(selectedMicrophoneStorageKey) ?? "";
}

function writeSavedMicrophoneId(deviceId: string): void {
  window.localStorage.setItem(selectedMicrophoneStorageKey, deviceId);
}

function normaliseMicrophoneOptions(devices: MediaDeviceInfo[]): MicrophoneOption[] {
  return devices
    .filter((device) => device.kind === "audioinput")
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `Microphone ${index + 1}`
    }));
}

export function App(): JSX.Element {
  const appName = window.shuneLekha?.appName ?? "Shune-Lekha";
  const phaseLabel = window.shuneLekha?.stage ?? "Phase 5";
  const shortcutLabel = window.shuneLekha?.shortcut ?? "Ctrl + Space";

  const [recordingState, setRecordingState] = useState<RecordingStatePayload>({
    status: "Idle",
    activeSince: null
  });
  const [elapsedLabel, setElapsedLabel] = useState("00:00");
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [trayMessage, setTrayMessage] = useState(
    "Tray mode is ready. Closing the window will keep the app running in the tray."
  );
  const [microphones, setMicrophones] = useState<MicrophoneOption[]>([]);
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState(
    readSavedMicrophoneId()
  );
  const [permissionState, setPermissionState] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [microphoneMessage, setMicrophoneMessage] = useState(
    "Microphone permission has not been requested yet."
  );
  const [isTestingMicrophone, setIsTestingMicrophone] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);

  const testStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    void window.shuneLekha?.getRecordingState?.().then((payload) => {
      setRecordingState(payload);
    });

    const unsubscribeSettings = window.shuneLekha?.onOpenSettings?.(() => {
      setTrayMessage(
        "Settings menu clicked. Microphone settings are available below for Phase 5."
      );
    });
    const unsubscribeState = window.shuneLekha?.onStateChange?.((payload) => {
      setRecordingState(payload);
    });
    const unsubscribeShortcutError = window.shuneLekha?.onShortcutError?.(
      (message) => {
        setShortcutError(message);
      }
    );

    return () => {
      unsubscribeSettings?.();
      unsubscribeState?.();
      unsubscribeShortcutError?.();
    };
  }, []);

  useEffect(() => {
    setElapsedLabel(formatDuration(recordingState.activeSince));

    if (!activeStates.has(recordingState.status) || !recordingState.activeSince) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedLabel(formatDuration(recordingState.activeSince));
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [recordingState]);

  useEffect(() => {
    const handleDeviceChange = () => {
      void refreshMicrophones();
    };

    navigator.mediaDevices?.addEventListener?.("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", handleDeviceChange);
    };
  }, []);

  useEffect(() => {
    void refreshMicrophones();

    return () => {
      stopMicrophoneTest();
    };
  }, []);

  async function refreshMicrophones(): Promise<void> {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setMicrophoneMessage(
        "This environment does not support microphone enumeration."
      );
      setPermissionState("denied");
      setMicrophones([]);
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const options = normaliseMicrophoneOptions(devices);
      setMicrophones(options);

      if (options.length === 0) {
        setMicrophoneMessage(
          permissionState === "granted"
            ? "No microphone was found. Connect an input device and try again."
            : "No microphone is available yet. Allow microphone access to detect devices."
        );
        return;
      }

      const savedId = readSavedMicrophoneId();
      const matchingSaved = options.find((option) => option.deviceId === savedId);
      const nextSelection = matchingSaved?.deviceId ?? options[0].deviceId;

      setSelectedMicrophoneId(nextSelection);
      writeSavedMicrophoneId(nextSelection);
      setMicrophoneMessage("Microphone list is ready.");
    } catch {
      setMicrophoneMessage("Failed to read available microphones.");
      setMicrophones([]);
    }
  }

  async function requestMicrophonePermission(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionState("denied");
      setMicrophoneMessage("This environment does not support microphone access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setPermissionState("granted");
      setMicrophoneMessage("Microphone access granted.");
      await refreshMicrophones();
    } catch {
      setPermissionState("denied");
      setMicrophoneMessage(
        "Microphone access was denied. Allow permission and try again."
      );
    }
  }

  function updateSelectedMicrophone(deviceId: string): void {
    setSelectedMicrophoneId(deviceId);
    writeSavedMicrophoneId(deviceId);
  }

  function stopMicrophoneTest(): void {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    analyserRef.current?.disconnect();
    analyserRef.current = null;

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    testStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    testStreamRef.current = null;

    setIsTestingMicrophone(false);
    setInputLevel(0);
  }

  async function startMicrophoneTest(): Promise<void> {
    if (!selectedMicrophoneId) {
      setMicrophoneMessage("Select a microphone before starting the test.");
      return;
    }

    stopMicrophoneTest();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: selectedMicrophoneId }
        }
      });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.84;
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.fftSize);

      const tick = () => {
        analyser.getByteTimeDomainData(buffer);

        let sum = 0;
        for (const value of buffer) {
          const normalized = (value - 128) / 128;
          sum += normalized * normalized;
        }

        const rms = Math.sqrt(sum / buffer.length);
        const nextLevel = Math.min(1, rms * 3.6);
        setInputLevel(nextLevel);
        animationFrameRef.current = window.requestAnimationFrame(tick);
      };

      testStreamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setIsTestingMicrophone(true);
      setPermissionState("granted");
      setMicrophoneMessage("Microphone test is active. Speak to see the input level.");
      tick();
      await refreshMicrophones();
    } catch {
      setPermissionState("denied");
      setMicrophoneMessage(
        "Unable to start the microphone test. Check permissions or choose another device."
      );
      stopMicrophoneTest();
    }
  }

  const selectedMicrophoneLabel =
    microphones.find((microphone) => microphone.deviceId === selectedMicrophoneId)
      ?.label ?? "No microphone selected";

  return (
    <main style={shellStyle}>
      <section style={cardStyle}>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#52606d"
          }}
        >
          {phaseLabel}
        </p>
        <h1
          style={{
            margin: "18px 0 12px",
            fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em"
          }}
        >
          {appName}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "1.2rem",
            lineHeight: 1.6,
            color: "#364152"
          }}
        >
          Local voice typing for Windows
        </p>
        <div style={{ marginTop: "28px" }}>
          <span style={badgeStyle}>{recordingState.status}</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginTop: "20px"
          }}
        >
          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Global shortcut</div>
            <div style={{ marginTop: "6px", fontSize: "1rem", color: "#364152" }}>
              <strong>{shortcutLabel}</strong>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Active timer</div>
            <div style={{ marginTop: "6px", fontSize: "1rem", color: "#364152" }}>
              <strong>{elapsedLabel}</strong>
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Current flow</div>
            <div style={{ marginTop: "6px", fontSize: "1rem", color: "#364152" }}>
              {stateDescriptions[recordingState.status]}
            </div>
          </div>
        </div>

        <section style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "18px",
              alignItems: "start",
              flexWrap: "wrap"
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.35rem",
                  color: "#1f2933"
                }}
              >
                Microphone Settings
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.96rem",
                  lineHeight: 1.7,
                  color: "#52606d"
                }}
              >
                Phase 5 adds microphone permission, device detection, saved device
                selection, and a live test level indicator.
              </p>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                background:
                  permissionState === "granted"
                    ? "#e8f7ee"
                    : permissionState === "denied"
                      ? "#fff1f2"
                      : "#eef2f7",
                color:
                  permissionState === "granted"
                    ? "#18794e"
                    : permissionState === "denied"
                      ? "#9f1239"
                      : "#52606d",
                fontSize: "0.9rem",
                fontWeight: 600
              }}
            >
              Permission: {permissionState}
            </div>
          </div>

          <div style={{ marginTop: "22px", display: "grid", gap: "18px" }}>
            <label style={labelStyle}>
              <span>Available microphones</span>
              <select
                value={selectedMicrophoneId}
                onChange={(event) => {
                  updateSelectedMicrophone(event.target.value);
                }}
                disabled={microphones.length === 0}
                style={selectStyle}
              >
                {microphones.length === 0 ? (
                  <option value="">No microphone detected</option>
                ) : (
                  microphones.map((microphone) => (
                    <option key={microphone.deviceId} value={microphone.deviceId}>
                      {microphone.label}
                    </option>
                  ))
                )}
              </select>
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px"
              }}
            >
              <div>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Selected microphone
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "#1f2933",
                    fontWeight: 600
                  }}
                >
                  {selectedMicrophoneLabel}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Input volume</div>
                <div
                  style={{
                    marginTop: "10px",
                    height: "14px",
                    borderRadius: "999px",
                    background: "#dbe4ee",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${Math.round(inputLevel * 100)}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(90deg, #1f4f46 0%, #2b6cb0 55%, #60a5fa 100%)",
                      transition: "width 90ms linear"
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "0.9rem",
                    color: "#52606d"
                  }}
                >
                  Level: {Math.round(inputLevel * 100)}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  void requestMicrophonePermission();
                }}
                style={actionButtonStyle}
              >
                Allow Microphone Access
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isTestingMicrophone) {
                    stopMicrophoneTest();
                    setMicrophoneMessage("Microphone test stopped.");
                    return;
                  }

                  void startMicrophoneTest();
                }}
                style={subtleButtonStyle}
                disabled={microphones.length === 0}
              >
                {isTestingMicrophone ? "Stop Test" : "Test Microphone"}
              </button>
              <button
                type="button"
                onClick={() => {
                  void refreshMicrophones();
                }}
                style={subtleButtonStyle}
              >
                Refresh Devices
              </button>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color:
                  permissionState === "denied" ? "#9f1239" : "#52606d"
              }}
            >
              {microphoneMessage}
            </p>
          </div>
        </section>

        <p
          style={{
            margin: "22px 0 0",
            fontSize: "0.98rem",
            lineHeight: 1.7,
            color: "#52606d"
          }}
        >
          {trayMessage}
        </p>

        {shortcutError ? (
          <p
            style={{
              margin: "18px 0 0",
              padding: "14px 16px",
              borderRadius: "16px",
              backgroundColor: "#fff1f2",
              color: "#9f1239",
              fontSize: "0.98rem",
              lineHeight: 1.6
            }}
          >
            {shortcutError}
          </p>
        ) : null}
      </section>
    </main>
  );
}
