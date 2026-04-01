import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  cardTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    marginTop: 8,
  },
  cardSubtitle: {
    color: colors.grayOpacized,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    color: colors.grayOpacized,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  sendBtn: {
    backgroundColor: colors.white,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: {
    color: colors.primaryGradientMid,
    fontSize: 16,
    fontWeight: "800",
  },
  linkBtn: { alignItems: "center", marginBottom: 8 },
  linkText: { color: colors.grayOpacized, fontSize: 14 },
  successContainer: { paddingTop: 16 },
  successText: {
    color: colors.grayOpacized,
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
  successEmail: { fontWeight: "800", color: colors.white },
  successHint: {
    color: colors.grayOpacized,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
});
