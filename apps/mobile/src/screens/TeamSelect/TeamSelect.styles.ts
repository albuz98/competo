import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const ts = StyleSheet.create({
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: colors.dark,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: colors.placeholder,
    textAlign: "center",
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },

  scrollContent: { padding: 16, gap: 10 },

  teamCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  teamCardSelected: {
    borderColor: colors.primaryGradientMid,
    backgroundColor: colors.gray,
  },

  teamAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  teamAvatarText: { color: colors.white, fontSize: 16, fontWeight: "800" },

  teamName: { fontSize: 14, fontWeight: "700", color: colors.dark },
  teamMeta: { fontSize: 12, color: colors.placeholder, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.grayDark,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: colors.primaryGradientMid,
    borderColor: colors.primaryGradientMid,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.placeholder,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    color: colors.grayDark,
    textAlign: "center",
    lineHeight: 20,
  },

  bottomBar: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 10,
  },
});
