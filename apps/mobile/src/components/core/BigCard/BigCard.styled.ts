import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  bigCard: { borderRadius: 18, overflow: "hidden" },
  bigCardGradient: { flex: 1, justifyContent: "flex-end" },
  bigCardDecor: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.darkOpacized,
  },
  bigCardEmoji: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    fontSize: 56,
    marginTop: -40,
  },
  bigCardOverlay: {
    backgroundColor: colors.grayOpacized,
    borderRadius: 12,
    margin: 10,
    padding: 10,
  },
  bigCardName: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.dark,
    letterSpacing: 0.2,
  },
  bigCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  bigCardLocationText: { fontSize: 11, color: colors.placeholder },
});
