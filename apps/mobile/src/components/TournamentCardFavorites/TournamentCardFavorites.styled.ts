import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

const { width: SW } = Dimensions.get("window");
export const CARD_W = SW - 32;
export const CARD_H = 200;

export const pf = StyleSheet.create({
  bookmarkBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grayOpacized,
    alignItems: "center",
    justifyContent: "center",
  },

  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardFee: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.dark,
    marginLeft: "auto" as any,
  },

  bigCard: { borderRadius: 18, overflow: "hidden" },
  bigCardGradient: { flex: 1, justifyContent: "flex-end" },
  whiteOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.opacized,
  },
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
  bigCardLocationText: { fontSize: 11, color: colors.dark },
});
