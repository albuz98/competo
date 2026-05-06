import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const s = StyleSheet.create({
  stepper: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnActive: { backgroundColor: colors.primarySelectedBg },
  stepperValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.dark,
    minWidth: 40,
    textAlign: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: colors.primaryGradientEnd,
    borderRadius: 5,
  },
});
