import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const pf = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.gray },

  // ── Sections ────────────────────────────────────────────
  section: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionLast: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 16,
    overflow: "hidden",
  },

  // ── Wallet section ───────────────────────────────────────
  walletTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  walletLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  eyeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 8,
  },
  walletAmountHidden: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 8,
    letterSpacing: 8,
  },
  ibanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  ibanText: { fontSize: 13, color: colors.white, fontWeight: "500" },

  // ── Wallet action buttons ────────────────────────────────
  walletActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  walletActionBtn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  walletActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  walletActionLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // ── Stats section ────────────────────────────────────────
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statsViewsLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  statsViewsCount: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.white,
  },
  statsViewsSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  promuoviBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  promuoviText: { fontSize: 13, fontWeight: "700", color: colors.dark },

  // ── Stat metric mini-cards ───────────────────────────────
  statMetricRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  statMetricPill: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 3,
  },
  statMetricBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  statMetricBadgeUp: {
    backgroundColor: "rgba(16,185,129,0.4)",
  },
  statMetricBadgeDown: {
    backgroundColor: "rgba(217,26,26,0.35)",
  },
  statMetricValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.white,
  },
  statMetricLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },

  // ── Nav button ───────────────────────────────────────────
  navBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "auto",
    paddingTop: 12,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
});
