import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  errorBox: {
    backgroundColor: colors.opacized,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.white, fontSize: 13, textAlign: "center" },
});
