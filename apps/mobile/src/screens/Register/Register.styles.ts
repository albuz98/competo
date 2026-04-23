import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  cardTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: colors.grayOpacized,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  fieldError: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 14,
    fontWeight: 800,
  },
});
