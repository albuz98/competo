import { colors } from "../theme/colors";
import { isMocking, apiFetch } from "./config";
import { mockFlags } from "./mockFlags";
import { OrganizerStatsOverview, OrganizerStatsSegment } from "../types/stats";

const mockStatsOverview: OrganizerStatsOverview = {
  views: 197736,
  viewsDelta: -3.02,
  usersReached: 50824,
  usersReachedDelta: 3.02,
  newClients: 12,
  newClientsDelta: 3.02,
  linkTouches: 72067,
  linkTouchesDelta: -3.02,
  month: "Maggio 2026",
};

const mockStatsSegments: OrganizerStatsSegment[] = [
  { percentage: 8, color: colors.gray, label: "Altro", count: 500 },
  { percentage: 13.8, color: colors.dark, label: "Diretto", count: 1000 },
  { percentage: 43.7, color: "#e879f9", label: "Social", count: 1500 },
  { percentage: 34.5, color: colors.primaryGradientMid, label: "Ricerca", count: 2000 },
];

export async function fetchStatsOverview(token: string): Promise<OrganizerStatsOverview> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_STATS_OVERVIEW) {
    await new Promise((r) => setTimeout(r, 300));
    return { ...mockStatsOverview };
  }
  return apiFetch<OrganizerStatsOverview>("/api/v1/organizer/stats", {}, token);
}

export async function fetchStatsSegments(token: string): Promise<OrganizerStatsSegment[]> {
  if (isMocking && mockFlags.IS_MOCKING_FETCH_STATS_SEGMENTS) {
    await new Promise((r) => setTimeout(r, 300));
    return [...mockStatsSegments];
  }
  return apiFetch<OrganizerStatsSegment[]>("/api/v1/organizer/stats/breakdown", {}, token);
}
