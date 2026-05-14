import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

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
});
