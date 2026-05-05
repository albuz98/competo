import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const ip = StyleSheet.create({
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
});
