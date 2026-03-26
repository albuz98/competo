import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cardTitle: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
