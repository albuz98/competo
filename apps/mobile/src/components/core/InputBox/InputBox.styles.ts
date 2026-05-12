import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 0,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
});
