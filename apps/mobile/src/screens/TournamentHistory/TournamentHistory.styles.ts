import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const ths = StyleSheet.create({
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

  scrollContent: { padding: 16, gap: 10 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 2,
  },
  meta: { fontSize: 12, color: colors.placeholder },
  team: { fontSize: 11, color: colors.grayDark, marginTop: 2 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.dark,
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.grayDark },
  emptySub: {
    fontSize: 13,
    color: colors.grayDark,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
