import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  cardTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  fieldError: {
    color: colors.danger,
    fontSize: 14,
    marginTop: -12,
    marginBottom: 14,
    fontWeight: 800,
  },
});
