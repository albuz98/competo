import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 10,
    minHeight: 100,
  },
  cardEdit: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  pencilBtn: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },

  // ── Info section (non-edit) ────────────────────────────────
  infoSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  extraBottomRow: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  email: { fontSize: 13, color: colors.placeholder, marginTop: 4 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.dark,
  },

  // ── Right actions column ───────────────────────────────────
  actionsCol: {
    alignItems: "center",
    gap: 8,
  },
  qrBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySelectedBg,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Saving overlay ─────────────────────────────────────────
  cardSavingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.opacized,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── QR Modal ───────────────────────────────────────────────
  qrModalContent: {
    alignItems: "center",
    paddingTop: 4,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  qrModalSub: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 28,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.gray,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  qrUrl: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 6,
  },
  qrHint: {
    fontSize: 12,
    color: colors.placeholder,
  },

  changePasswordBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    marginTop: 12,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
    marginRight: 6,
  },
});
