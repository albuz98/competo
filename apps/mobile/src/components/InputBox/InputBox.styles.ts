import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.opacized,
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
});
