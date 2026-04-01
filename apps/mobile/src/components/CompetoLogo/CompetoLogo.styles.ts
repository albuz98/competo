import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  logoArea: { alignItems: "center", marginTop: 16 },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
    fontStyle: "italic",
  },
  logoTagline: {
    color: colors.grayOpacized,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
    marginTop: 2,
  },
});
