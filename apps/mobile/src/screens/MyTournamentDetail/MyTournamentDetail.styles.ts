import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

// ─── Bracket layout constants (also used by OrganizerTournamentDetail) ────────

export const CARD_H = 72;
export const CARD_W = 150;
export const COL_GAP = 40;
export const SLOT_H = 100;
export const LABEL_H = 32;
export const LINE_W = 1.5;
export const LINE_COLOR = colors.grayDark;

// ─── Styles ───────────────────────────────────────────────────────────────────

export const tds = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

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
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.opacized,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginLeft: 38,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusText: { color: colors.white, fontSize: 12, fontWeight: "600" },

  // Group / match cards
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 12,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  matchTeam: { flex: 2, fontSize: 13, color: colors.dark, fontWeight: "500" },
  matchTeamRight: { textAlign: "right" },
  matchTeamMy: { color: colors.primaryGradientMid, fontWeight: "700" },
  matchScore: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: colors.dark,
  },
  matchScoreLive: { color: colors.primaryGradientMid },
  matchRound: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 2,
    textAlign: "center",
  },
  liveTag: {
    backgroundColor: colors.primaryGradientMid,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignSelf: "center",
    marginTop: 2,
  },
  liveTagText: { color: colors.white, fontSize: 9, fontWeight: "700" },

  // Standings
  standingsHeader: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayDark,
    marginBottom: 4,
  },
  standingsHeaderCell: {
    width: 28,
    fontSize: 11,
    color: colors.placeholder,
    fontWeight: "600",
    textAlign: "center",
  },
  standingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  standingsPos: {
    width: 22,
    fontSize: 12,
    fontWeight: "700",
    color: colors.placeholder,
    textAlign: "center",
  },
  standingsTeam: {
    flex: 1,
    fontSize: 13,
    color: colors.dark,
    fontWeight: "600",
  },
  standingsTeamMy: { color: colors.primaryGradientMid },
  standingsCell: {
    width: 28,
    fontSize: 12,
    color: colors.placeholder,
    textAlign: "center",
  },
  standingsPts: {
    width: 28,
    fontSize: 13,
    fontWeight: "800",
    color: colors.dark,
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
    color: colors.dark,
    textAlign: "center",
  },
  waitingText: {
    fontSize: 14,
    color: colors.placeholder,
    textAlign: "center",
    lineHeight: 22,
  },

  // Bracket match card
  bracketMatchCard: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: colors.white,
    borderRadius: 10,
    overflow: "hidden",
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  bracketMatchCardLive: { borderLeftColor: colors.primaryGradientMid },
  bracketTeamRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  bracketTeamRowLast: { borderBottomWidth: 0 },
  bracketTeamName: {
    flex: 1,
    fontSize: 11,
    color: colors.dark,
    fontWeight: "500",
  },
  bracketTeamNameMy: { color: colors.primaryGradientMid, fontWeight: "700" },
  bracketScore: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.dark,
    minWidth: 16,
    textAlign: "right",
  },
  bracketColLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.placeholder,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
