import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

// ─── Bracket layout constants (also used by OrganizerTournamentDetail) ────────

export const CARD_H = 72;
export const CARD_W = 150;
export const COL_GAP = 40;
export const SLOT_H = 100;
export const LABEL_H = 32;
export const LINE_W = 1.5;
export const LINE_COLOR = "#cbd5e1";

// ─── Styles ───────────────────────────────────────────────────────────────────

export const tds = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

  // Header
  header: { paddingBottom: 20, paddingHorizontal: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginLeft: 38,
    marginTop: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10b981" },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: colors.primary },
  tabLabel: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  tabLabelActive: { color: "#fff" },

  // Group / match cards
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  matchTeam: { flex: 2, fontSize: 13, color: "#1e293b", fontWeight: "500" },
  matchTeamRight: { textAlign: "right" },
  matchTeamMy: { color: colors.primary, fontWeight: "700" },
  matchScore: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
  },
  matchScoreLive: { color: colors.primary },
  matchRound: { fontSize: 11, color: "#94a3b8", marginTop: 2, textAlign: "center" },
  liveTag: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignSelf: "center",
    marginTop: 2,
  },
  liveTagText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  // Standings
  standingsHeader: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 4,
  },
  standingsHeaderCell: {
    width: 28,
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    textAlign: "center",
  },
  standingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  standingsPos: {
    width: 22,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
  },
  standingsTeam: { flex: 1, fontSize: 13, color: "#1e293b", fontWeight: "600" },
  standingsTeamMy: { color: colors.primary },
  standingsCell: { width: 28, fontSize: 12, color: "#64748b", textAlign: "center" },
  standingsPts: {
    width: 28,
    fontSize: 13,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },

  // Not generated / waiting
  waitingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  waitingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
  },
  waitingText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },

  // Bracket match card
  bracketMatchCard: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  bracketMatchCardLive: { borderLeftColor: colors.primary },
  bracketTeamRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  bracketTeamRowLast: { borderBottomWidth: 0 },
  bracketTeamName: { flex: 1, fontSize: 11, color: "#1e293b", fontWeight: "500" },
  bracketTeamNameMy: { color: colors.primary, fontWeight: "700" },
  bracketScore: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e293b",
    minWidth: 16,
    textAlign: "right",
  },
  bracketColLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
