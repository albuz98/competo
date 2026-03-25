import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  topArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
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
