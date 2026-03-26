import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  thirdBtn: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: colors.primary, fontSize: 16, fontWeight: "800" },
  secondaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  thirdBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkBtn: { alignItems: "center", marginBottom: 8 },
  linkText: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
});
