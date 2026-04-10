import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { ITEM_H } from "./DatePicker";

const VISIBLE_ITEMS = 5;
const PICKER_H = ITEM_H * VISIBLE_ITEMS;

export const dp = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
  },
  headerBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  cancelText: {
    fontSize: 15,
    color: colors.placeholder,
    fontWeight: "600",
  },
  confirmText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "700",
  },
  columns: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  colLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  list: {
    height: PICKER_H,
    width: "100%",
  },
  listContent: {
    paddingVertical: (PICKER_H - ITEM_H) / 2,
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  itemSelected: {
    backgroundColor: colors.primarySelectedBg,
  },
  itemText: {
    fontSize: 16,
    color: colors.placeholder,
    fontWeight: "500",
  },
  itemTextSelected: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 18,
  },
});
