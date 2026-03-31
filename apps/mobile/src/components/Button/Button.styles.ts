import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  btnFullColored: {
    borderRadius: 15,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    elevation: 4,
  },
  btnBorderColored: {
    borderRadius: 15,
    alignItems: "center",
  },
  btnBase: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  btnDisabled: { opacity: 0.6 },
  linkBtn: { alignItems: "center", marginBottom: 8 },
  btnAccept: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
  },
  textAccept: { color: "#fff", fontSize: 13, fontWeight: "700" },
  btnReject: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ef4444",
  },
  textReject: { color: "#ef4444", fontSize: 13, fontWeight: "700" },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSelected: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.disabled,
    backgroundColor: colors.disabledBg,
  },
  btnSelectedActive: {
    borderColor: colors.primaryGradientMid,
    backgroundColor: colors.primarySelectedBg,
  },
  btnSelectedText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.placeholder,
  },
  btnSelectedTextActive: { color: colors.primaryGradientMid },
});
