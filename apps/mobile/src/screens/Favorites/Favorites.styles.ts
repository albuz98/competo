import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";

const { width: SW } = Dimensions.get("window");
export const CARD_W = SW - 32;
export const CARD_H = 200;
export const CARD_IMG_H = 160;

export const pf = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.dark,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.grayDark,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.grayOpacized,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

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
