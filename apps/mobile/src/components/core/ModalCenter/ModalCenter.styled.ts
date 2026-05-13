import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const tds = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.opacized,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "100%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: colors.opacized,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    color: colors.black,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 20,
  },
  modalRemoveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    color: colors.white,
  },
  modalApproveBtn: {
    flex: 1,
    backgroundColor: colors.primaryGradientEnd,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    color: colors.white,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 10,
  },
});
