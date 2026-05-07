import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const pStyles = StyleSheet.create({
  statsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  statsCardInner: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statBubble: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray,
    alignSelf: "stretch",
  },
  statsTourneyRow: {
    flexDirection: "row",
    paddingVertical: 14,
  },
  statTourney: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statTourneyNum: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
  },
  statTourneyLabel: {
    fontSize: 10,
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statTourneyDivider: {
    width: 1,
    backgroundColor: colors.gray,
    alignSelf: "stretch",
  },

  // ── Career stats (role-based) ───────────────────────────────────
  careerCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  careerCardInner: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "row",
    paddingVertical: 20,
  },
  careerBubble: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  careerNum: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  careerLabel: {
    fontSize: 11,
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  careerDivider: {
    width: 1,
    backgroundColor: colors.gray,
    alignSelf: "stretch",
  },

  // ── Tournament history ──────────────────────────────────────────
  historyCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  historyIconText: {
    fontSize: 20,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 2,
  },
  historyMeta: {
    fontSize: 12,
    color: colors.placeholder,
  },
  historyTeam: {
    fontSize: 11,
    color: colors.grayDark,
    marginTop: 2,
  },
  historyBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  historyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.dark,
  },

  // ── Coach card decorations ─────────────────────────────────────
  coachCardYellow: {
    width: 16,
    height: 20,
    borderRadius: 3,
    backgroundColor: colors.primaryGradientEnd,
  },
  coachCardRed: {
    width: 16,
    height: 20,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },

  // ── Email verification ─────────────────────────────────────────
  sendCodeRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  emailVerifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  emailVerifiedText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.success,
  },

  // ── Location search ────────────────────────────────────────────
  locationSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  locationLabel: {
    fontSize: 11,
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // ── Gender selector ────────────────────────────────────────────
  genderRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  genderLabel: {
    fontSize: 11,
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: "hidden",
  },
  genderOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.primary,
  },
  genderOptionFirst: {
    borderLeftWidth: 0,
  },
  genderOptionLast: {
    borderRightWidth: 0,
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  genderOptionTextSelected: {
    color: colors.white,
  },
});
