import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  // auth variant
  wrapper: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.grayOpacized,
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  inputError: { borderColor: colors.danger },
  iconBtn: {
    position: "absolute",
    right: 14,
    top: 4,
    bottom: 0,
  },

  // row variant
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
    gap: 8,
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
  rowInputError: {
    borderBottomColor: colors.danger,
  },
  rowError: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
