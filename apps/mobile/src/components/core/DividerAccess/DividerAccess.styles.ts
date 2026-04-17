import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grayOpacized,
  },
  dividerText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
});
