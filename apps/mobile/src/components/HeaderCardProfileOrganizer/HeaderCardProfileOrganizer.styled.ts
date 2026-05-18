import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  // ── Company icon ───────────────────────────────────────────
  iconWrapper: {
    position: "relative",
    alignSelf: "center",
  },
  companyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.primarySelectedBg,
    alignItems: "center",
    justifyContent: "center",
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

  // ── Info section ───────────────────────────────────────────
  infoSection: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 4,
  },
  orgName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.dark,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.black,
  },

  // ── Right badges column ────────────────────────────────────
  badgesCol: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingRight: 4,
  },
  badgeItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Change password ────────────────────────────────────────
  changePasswordBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
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

  // ── Premium upgrade banner ─────────────────────────────────
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.white,
  },
  premiumInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginTop: 4,
  },
});
