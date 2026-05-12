import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const tds = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: colors.primaryGradientMid,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.placeholder,
  },
  tabBtnTextActive: {
    color: colors.white,
  },
});
