import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const sStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    overflow: "hidden",
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.white,
    marginTop: -1,
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  textActive: {
    color: colors.white,
  },
});
