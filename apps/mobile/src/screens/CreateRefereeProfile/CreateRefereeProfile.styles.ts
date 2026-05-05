import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
  },

  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

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

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 20,
  },

  inputWrap: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.dark,
    padding: 0,
  },
  inputFocused: {
    borderColor: colors.primary,
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
    marginTop: 20,
    marginBottom: 8,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: colors.darkBlue,
    lineHeight: 18,
  },

  submitBtn: {
    backgroundColor: colors.purpleBlue,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  submitBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
});
