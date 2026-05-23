import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

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

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  margin: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  overflow: "hidden",
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
};

const pillStyle: React.CSSProperties = {
  width: "188px",
  minHeight: "54px",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  borderRadius: "999px",
  background:
    "linear-gradient(180deg, rgba(28, 37, 56, 0.96) 0%, rgba(14, 20, 34, 0.98) 100%)",
  color: "#f8fafc",
  boxShadow: "0 14px 28px rgba(7, 12, 24, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(163, 184, 255, 0.14)",
  position: "relative",
  overflow: "hidden"
};

const dotStyle: React.CSSProperties = {
  width: "12px",
  height: "12px",
  borderRadius: "999px",
  background: "radial-gradient(circle at 35% 35%, #ffb3a7 0%, #ff5f52 40%, #ff3b30 100%)",
  boxShadow: "0 0 0 6px rgba(255, 82, 82, 0.16), 0 0 16px rgba(255, 82, 82, 0.45)"
};

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

function getBarHeights(status: RecordingState): number[] {
  switch (status) {
    case "Starting Recording":
      return [10, 14, 18, 22, 24, 24, 22, 18, 14, 10];
    case "Recording":
      return [14, 20, 28, 34, 38, 38, 34, 28, 20, 14];
    case "Stopping Recording":
      return [12, 16, 22, 28, 30, 30, 28, 22, 16, 12];
    case "Processing":
      return [8, 12, 16, 20, 24, 24, 20, 16, 12, 8];
    case "Completed":
      return [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    default:
      return [8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
  }
}

function getStatusLabel(status: RecordingState): string {
  switch (status) {
    case "Starting Recording":
      return "Starting";
    case "Recording":
      return "Recording";
    case "Stopping Recording":
      return "Stopping";
    case "Processing":
      return "Processing";
    case "Completed":
      return "Done";
    case "Error":
      return "Error";
    default:
      return "Idle";
  }
}

function OverlayApp(): JSX.Element {
  const [recordingState, setRecordingState] = useState<RecordingStatePayload>({
    status: "Idle",
    activeSince: null
  });
  const [elapsedLabel, setElapsedLabel] = useState("00:00");

  useEffect(() => {
    void window.shuneLekha?.getRecordingState?.().then((payload) => {
      setRecordingState(payload);
    });

    const unsubscribe = window.shuneLekha?.onStateChange?.((payload) => {
      setRecordingState(payload);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    setElapsedLabel(formatDuration(recordingState.activeSince));

    if (!recordingState.activeSince) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedLabel(formatDuration(recordingState.activeSince));
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [recordingState]);

  const barHeights = getBarHeights(recordingState.status);
  const isRecording = recordingState.status === "Recording";

  return (
    <main style={containerStyle}>
      <style>
        {`
          @keyframes overlay-bar-breathe {
            0%, 100% { transform: scaleY(0.62); opacity: 0.84; }
            50% { transform: scaleY(1); opacity: 1; }
          }
        `}
      </style>
      <section style={pillStyle}>
        <div style={dotStyle} />
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            gap: "4px"
          }}
        >
          <div
            style={{
              fontSize: "0.66rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(226, 232, 240, 0.72)",
              lineHeight: 1
            }}
          >
            {isRecording ? elapsedLabel : getStatusLabel(recordingState.status)}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              minHeight: "38px"
            }}
          >
            {barHeights.map((height, index) => (
              <span
                key={`${recordingState.status}-${index}`}
                style={{
                  width: "5px",
                  height: `${height}px`,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(226,232,240,0.92) 100%)",
                  boxShadow: "0 0 10px rgba(255,255,255,0.18)",
                  transformOrigin: "center",
                  animation: isRecording
                    ? `overlay-bar-breathe ${780 + index * 35}ms ease-in-out infinite`
                    : undefined,
                  animationDelay: `${index * 45}ms`,
                  opacity: isRecording ? 1 : 0.9
                }}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.shuneLekha?.cancelRecording?.();
          }}
          style={{
            border: "none",
            borderRadius: "999px",
            width: "28px",
            height: "28px",
            padding: 0,
            background: "rgba(255, 255, 255, 0.08)",
            color: "rgba(248, 250, 252, 0.9)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 700,
            lineHeight: 1
          }}
          aria-label="Cancel fake recording"
        >
          x
        </button>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <OverlayApp />
  </React.StrictMode>
);
