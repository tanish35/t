import type { recordingStatus } from "@/db/schema";

export type RecordingStatus = (typeof recordingStatus.enumValues)[number];

export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  recordingCount: number;
  eventCount: number;
  lastRecordingLabel: string | null;
};

export type RecentRecording = {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: RecordingStatus;
  eventCount: number;
  durationLabel: string | null;
  createdLabel: string;
};

export type MonthlyBucket = {
  month: string;
  year: number;
  ready: number;
  inFlight: number;
};

export type DashboardData = {
  totals: {
    recordings: number;
    projects: number;
    events: number;
    readyRate: number;
    recordingsDeltaPct: number;
  };
  monthly: Array<MonthlyBucket>;
  projects: Array<ProjectSummary>;
  recent: Array<RecentRecording>;
};

export const MOCK_DASHBOARD: DashboardData = {
  totals: {
    recordings: 2025,
    projects: 4,
    events: 184320,
    readyRate: 0.86,
    recordingsDeltaPct: 14,
  },

  monthly: [
    { month: "Feb", year: 2026, ready: 118, inFlight: 34 },
    { month: "Mar", year: 2026, ready: 164, inFlight: 41 },
    { month: "Apr", year: 2026, ready: 143, inFlight: 22 },
    { month: "May", year: 2026, ready: 209, inFlight: 48 },
    { month: "Jun", year: 2026, ready: 187, inFlight: 29 },
    { month: "Jul", year: 2026, ready: 246, inFlight: 57 },
  ],

  projects: [
    {
      id: "prj_kx91mfa2ct0d",
      name: "Checkout flow",
      description: "Payment funnel regressions",
      recordingCount: 842,
      eventCount: 76340,
      lastRecordingLabel: "12 minutes ago",
    },
    {
      id: "prj_bd47qzr8ev1n",
      name: "Marketing site",
      description: "Landing page + pricing",
      recordingCount: 613,
      eventCount: 51890,
      lastRecordingLabel: "3 hours ago",
    },
    {
      id: "prj_ty03wnl5hs9k",
      name: "Admin console",
      description: "Internal tooling",
      recordingCount: 402,
      eventCount: 39215,
      lastRecordingLabel: "yesterday",
    },
    {
      id: "prj_qm82vcx6bp4j",
      name: "Mobile web",
      description: null,
      recordingCount: 168,
      eventCount: 16875,
      lastRecordingLabel: "4 days ago",
    },
  ],

  recent: [
    {
      id: "rec_9fk21mza7xq0",
      name: "Guest checkout — card declined",
      projectId: "prj_kx91mfa2ct0d",
      projectName: "Checkout flow",
      status: "ready",
      eventCount: 1240,
      durationLabel: "4m 12s",
      createdLabel: "12m ago",
    },
    {
      id: "rec_3ptw84nvd6ls",
      name: "Pricing page scroll depth",
      projectId: "prj_bd47qzr8ev1n",
      projectName: "Marketing site",
      status: "processing",
      eventCount: 862,
      durationLabel: "2m 48s",
      createdLabel: "38m ago",
    },
    {
      id: "rec_7hzq05ebmr3c",
      name: "Bulk user import",
      projectId: "prj_ty03wnl5hs9k",
      projectName: "Admin console",
      status: "ready",
      eventCount: 2104,
      durationLabel: "7m 03s",
      createdLabel: "2h ago",
    },
    {
      id: "rec_1cnd63yswk8v",
      name: "Signup — OAuth callback",
      projectId: "prj_kx91mfa2ct0d",
      projectName: "Checkout flow",
      status: "failed",
      eventCount: 96,
      durationLabel: null,
      createdLabel: "5h ago",
    },
    {
      id: "rec_5vjr72axtq9m",
      name: "Nav menu on small viewport",
      projectId: "prj_qm82vcx6bp4j",
      projectName: "Mobile web",
      status: "recording",
      eventCount: 318,
      durationLabel: null,
      createdLabel: "6h ago",
    },
  ],
};

export function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k >= 100 ? Math.round(k) : k.toFixed(1)}K`;
  }
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function withThousands(n: number): string {
  return n.toLocaleString("en-US");
}
