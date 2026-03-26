import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  topArea: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  closeBtn: {
    padding: 4,
    justifyContent: "flex-end",
    right: 30,
    top: 20,
    position: "absolute",
    backgroundColor: colors.primaryGradientMidOpacized,
    borderRadius: 50,
  },
  backArrow: { color: "#fff", fontSize: 20, lineHeight: 24 },
  backText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  cardContent: { padding: 28, paddingBottom: 40, flexGrow: 1 },
});
