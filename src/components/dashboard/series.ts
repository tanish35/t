import type { RecordingStatus } from "@/lib/mock-dashboard";

export const SERIES = {
  ready: { label: "Ready", fill: "var(--mint)" },
  inFlight: { label: "In flight", fill: "var(--violet)" },
} as const;

export const STATUS_META: Record<
  RecordingStatus,
  { label: string; color: string }
> = {
  ready: { label: "Ready", color: "#0ca30c" },
  processing: { label: "Processing", color: "#fab219" },
  recording: { label: "Recording", color: "#6d4aff" },
  created: { label: "Queued", color: "#878c86" },
  failed: { label: "Failed", color: "#d03b3b" },
};
