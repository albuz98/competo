import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const tds = StyleSheet.create({
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 12,
  },
  memberRowRep: { backgroundColor: colors.primarySelectedBg },
  memberAvatar: {},
  memberAvatarRep: {},
  memberAvatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { color: colors.white, fontSize: 16, fontWeight: "800" },
  memberNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  memberName: { fontSize: 14, fontWeight: "700", color: colors.dark },
  crownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.primarySelectedBg,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  crownText: {
    fontSize: 10,
    color: colors.primaryGradientMid,
    fontWeight: "700",
  },
  memberUsername: { fontSize: 12, color: colors.placeholder, marginTop: 1 },
  rolePillStatic: {
    backgroundColor: colors.gray,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rolePillText: { fontSize: 10, color: colors.placeholder, fontWeight: "600" },
  rolePillEditable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.primarySelectedBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rolePillEditableText: { fontSize: 10, color: colors.primary, fontWeight: "700" },
  jerseyBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  jerseyBadgeEditable: {
    backgroundColor: colors.primarySelectedBg,
  },
  jerseyText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.placeholder,
  },
  jerseyTextEditable: {
    color: colors.primary,
  },
  jerseyEmpty: {
    fontSize: 18,
    color: colors.primaryGradientMid,
    lineHeight: 22,
  },
});
