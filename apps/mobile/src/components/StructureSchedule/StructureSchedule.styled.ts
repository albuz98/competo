import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

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
