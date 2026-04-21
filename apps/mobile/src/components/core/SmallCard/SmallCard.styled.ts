import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { SMALL_W } from "../../../screens/Home/Home.styles";

export const styles = StyleSheet.create({
  smallCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 15,
  },
  smallCardTop: {
    height: SMALL_W * 0.85,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  smallCardEmoji: { fontSize: 44 },
  smallCardBody: { padding: 10 },
  smallCardName: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  smallCardRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  smallCardMeta: { fontSize: 10, color: colors.placeholder, flex: 1 },
});
