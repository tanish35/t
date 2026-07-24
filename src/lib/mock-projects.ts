import { MOCK_DASHBOARD, type RecentRecording } from "@/lib/mock-dashboard";

export const MOCK_PROJECTS = MOCK_DASHBOARD.projects.map((project, index) => ({
  ...project,
  createdLabel: ["Jul 4, 2026", "Jun 18, 2026", "May 9, 2026", "Apr 22, 2026"][index],
  tokens: [
    { name: "Production ingest", value: "rpf_live_••••7k2m", createdLabel: "Jul 4, 2026" },
    { name: "Staging ingest", value: "rpf_test_••••3d9q", createdLabel: "Jul 12, 2026" },
  ].slice(0, index === 2 ? 1 : 2),
}));

export const MOCK_PROJECT_RECORDINGS: Record<string, Array<RecentRecording>> =
  Object.fromEntries(
    MOCK_PROJECTS.map((project, index) => [
      project.id,
      MOCK_DASHBOARD.recent.filter((recording) => recording.projectId === project.id).concat({
        id: `rec_mock_${project.id}`,
        name: ["Address autocomplete", "Homepage CTA", "Role permissions", "Passwordless sign-in"][index],
        projectId: project.id,
        projectName: project.name,
        status: index === 1 ? "processing" : "ready",
        eventCount: [684, 435, 972, 256][index],
        durationLabel: ["3m 41s", "1m 56s", "5m 18s", "2m 09s"][index],
        createdLabel: ["1d ago", "2d ago", "3d ago", "5d ago"][index],
      }),
    ]),
  );
