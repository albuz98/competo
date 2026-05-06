import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    gap: 8,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: {
    fontSize: 11,
    color: colors.placeholder,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rowInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowInput: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingVertical: 2,
    flex: 1,
  },
  rowInputWithIcon: {
    paddingRight: 36,
  },
  rowEyeBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
    height: undefined,
  },
  rowInputError: {
    borderBottomColor: colors.danger,
  },
  rowInputDisabled: {
    color: colors.disabledText,
    borderBottomColor: colors.disabled,
  },
  rowError: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
