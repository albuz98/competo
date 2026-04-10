import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    textAlign: "center",
  },
  headerSide: { width: 36 },

  // Step indicator
  stepBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 0,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray,
    borderWidth: 2,
    borderColor: colors.disabled,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotDone: {
    backgroundColor: colors.primarySelectedBg,
    borderColor: colors.primary,
  },
  stepDotText: { fontSize: 13, fontWeight: "800", color: colors.placeholder },
  stepDotTextActive: { color: colors.white },
  stepDotTextDone: { color: colors.primary },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.disabled,
    maxWidth: 40,
  },
  stepLineDone: { backgroundColor: colors.primary },

  // Content
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.placeholder,
    marginBottom: 20,
    lineHeight: 18,
  },

  // Option cards (phase / format selector)
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.disabled,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySelectedBg,
  },
  optionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray,
  },
  optionCardIconSelected: { backgroundColor: colors.primaryGradientMid },
  optionCardBody: { flex: 1 },
  optionCardTitle: { fontSize: 14, fontWeight: "700", color: colors.dark },
  optionCardSub: {
    fontSize: 11,
    color: colors.placeholder,
    marginTop: 2,
    lineHeight: 15,
  },
  optionCardCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCardCheckSelected: {
    backgroundColor: colors.primaryGradientMid,
    borderColor: colors.primaryGradientMid,
  },
  singleDay: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 18,
  },

  // Participant rows
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.disabled,
    gap: 8,
  },
  participantIndex: {
    width: 24,
    fontSize: 12,
    fontWeight: "700",
    color: colors.placeholder,
    textAlign: "center",
  },
  participantNameInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.dark,
    paddingVertical: 10,
  },
  participantSeedInput: {
    width: 44,
    fontSize: 13,
    fontWeight: "600",
    color: colors.dark,
    textAlign: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.gray,
    paddingLeft: 8,
    paddingVertical: 10,
  },

  addParticipantBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    marginTop: 4,
    marginBottom: 16,
  },
  addParticipantText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  // Toggle row (seeding / final day)
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginBottom: 8,
  },
  toggleLabel: { fontSize: 14, fontWeight: "600", color: colors.dark },
  toggleSub: { fontSize: 11, color: colors.placeholder, marginTop: 1 },

  // Stepper (- n +)
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginBottom: 8,
  },
  fieldLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.dark },
  fieldSub: { fontSize: 11, color: colors.placeholder },
  fieldMinInput: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },

  // Number input row
  numberInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginBottom: 8,
  },
  numberInput: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
    minWidth: 60,
  },
  numberInputSuffix: { fontSize: 12, color: colors.placeholder, marginLeft: 4 },

  // Days selector
  daysRow: { flexDirection: "row", gap: 8, marginBottom: 8, flexWrap: "wrap" },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.disabled,
  },
  dayBtnSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayBtnText: { fontSize: 12, fontWeight: "700", color: colors.placeholder },
  dayBtnTextSelected: { color: colors.white },

  // Warning / info box
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FFF8F5",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
    marginTop: 8,
    marginBottom: 16,
  },
  infoBoxText: { flex: 1, fontSize: 12, color: "#78350f", lineHeight: 18 },

  warningBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fcd34d",
    marginTop: 8,
    marginBottom: 16,
  },
  warningBoxText: { flex: 1, fontSize: 12, color: "#92400e", lineHeight: 18 },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  btnNext: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: { fontSize: 15, fontWeight: "700", color: colors.white },
  btnNextDisabled: { opacity: 0.5 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
});
