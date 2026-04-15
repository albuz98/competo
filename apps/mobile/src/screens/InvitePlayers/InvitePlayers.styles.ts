import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const ip = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    paddingLeft: 4,
  },
  teamName: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: "center",
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },

  cercaContainer: {
    padding: 16,
    gap: 4,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 12,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.placeholder,
  },
  userName: { fontSize: 14, fontWeight: "700", color: colors.dark },
  userUsername: { fontSize: 12, color: colors.placeholder, marginTop: 1 },

  alreadyBadge: {
    backgroundColor: colors.gray,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  alreadyBadgeText: {
    fontSize: 11,
    color: colors.placeholder,
    fontWeight: "600",
  },

  invitedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.successBg,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  invitedBadgeText: { fontSize: 11, color: colors.success, fontWeight: "700" },

  hintBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  hintText: {
    fontSize: 13,
    color: colors.placeholder,
    textAlign: "center",
    lineHeight: 20,
  },

  shareTab: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  shareIllustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 8,
  },
  shareSub: {
    fontSize: 13,
    color: colors.placeholder,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  linkBox: {
    backgroundColor: colors.disabled,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.grayDark,
    alignSelf: "stretch",
    marginBottom: 20,
  },
  linkText: {
    fontSize: 13,
    color: colors.placeholder,
    fontFamily: "monospace" as any,
  },
  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
});
