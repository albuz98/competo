import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const CARD_WIDTH = SCREEN_WIDTH * 0.75;
export const CARD_HEIGHT = CARD_WIDTH * 1.3;
export const CARD_GAP = 16;
export const SNAP = CARD_WIDTH + CARD_GAP;
export const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  carouselWrapper: {
    height: CARD_HEIGHT + 40,
    overflow: "hidden",
    zIndex: 99,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.2,
  },
  circleLarge: {
    width: CARD_WIDTH * 1.1,
    height: CARD_WIDTH * 1.1,
    top: -CARD_WIDTH * 0.3,
    right: -CARD_WIDTH * 0.3,
  },
  circleSmall: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.5,
    bottom: -CARD_WIDTH * 0.1,
    left: -CARD_WIDTH * 0.1,
  },
  cardEmoji: { fontSize: 96 },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    zIndex: 2,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grayOpacized,
  },
  dotActive: { backgroundColor: colors.white, width: 22 },

  textBlock: {
    paddingHorizontal: 28,
    zIndex: 2,
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
});
