import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
  },
  headerSpacer: { width: 32 },

  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: colors.placeholder,
    lineHeight: 18,
    marginBottom: 16,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  sendBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
  sendBtnTextDisabled: {
    color: colors.grayDark,
  },

  mockSmsBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.blueBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  mockSmsText: {
    flex: 1,
    fontSize: 12,
    color: colors.darkBlue,
    lineHeight: 18,
  },
  mockSmsCode: {
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 2,
  },

  verifyBtn: {
    backgroundColor: colors.purpleBlue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  verifyBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },

  successBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.successBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.success,
    alignItems: "center",
    marginTop: 8,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
  },
});
