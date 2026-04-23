import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.darkSemiOpacized,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragZone: {
    paddingBottom: 4,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grayDark,
    alignSelf: "center",
    marginBottom: 16,
  },
});
