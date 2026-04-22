import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  vCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 82,
  },
  vCardGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  vCardEmoji: {
    fontSize: 34,
  },
  vCardContent: {
    flex: 1,
  },
  vCardName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 5,
  },
  vCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 2,
  },
  vCardMeta: {
    fontSize: 12,
    color: colors.white,
    flex: 1,
  },
});
