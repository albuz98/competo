import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const s = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 },

  heroBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purpleBlueBg,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.dark,
  },
  heroSub: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 2,
    lineHeight: 17,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.placeholder,
    marginBottom: 18,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.disabled,
  },
  chipSelected: {
    backgroundColor: colors.purpleBlueBg,
    borderColor: colors.purpleBlue,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.placeholder },
  chipTextSelected: { color: colors.purpleBlue },

  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.blueBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    marginTop: 8,
    marginBottom: 8,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: colors.darkBlue,
    lineHeight: 18,
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginBottom: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  summaryKey: {
    fontSize: 12,
    color: colors.placeholder,
    fontWeight: "600",
    flex: 1,
  },
  summaryVal: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: "700",
    flex: 2,
    textAlign: "right",
  },
  summaryDivider: { height: 1, backgroundColor: colors.gray },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginBottom: 8,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkText: { flex: 1, fontSize: 13, color: colors.dark, lineHeight: 19 },
  checkLink: { color: colors.primary, fontWeight: "700" },

  segmentedRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  segmentedItem: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.disabled,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  segmentedItemActive: {
    borderColor: colors.purpleBlue,
    backgroundColor: colors.purpleBlueBg,
  },
  segmentedText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.placeholder,
  },
  segmentedTextActive: {
    color: colors.purpleBlue,
  },
  segmentedSub: {
    fontSize: 10,
    color: colors.placeholder,
    marginTop: 2,
    textAlign: "center",
  },
  segmentedSubActive: {
    color: colors.purpleBlue,
  },

  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  hintBoxText: {
    flex: 1,
    fontSize: 11,
    color: colors.placeholder,
    lineHeight: 16,
  },
});
