import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
