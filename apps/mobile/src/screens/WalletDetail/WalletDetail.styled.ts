import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const wd = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },

  // ── Gradient header ──────────────────────────────────────
  header: {
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  topBarSpacer: { width: 38 },

  // ── Balance area (inside header) ─────────────────────────
  balanceArea: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  amount: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 4,
  },
  amountHidden: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 4,
    letterSpacing: 10,
  },
  balanceTrend: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(134,239,172,0.9)",
    marginBottom: 14,
  },
  ibanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  ibanText: { fontSize: 13, color: colors.white, fontWeight: "500" },

  // ── Content area (gray background) ───────────────────────
  content: {
    flex: 1,
    backgroundColor: colors.gray,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  // ── Action buttons card ──────────────────────────────────
  actionsCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  actionItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 11,
    color: colors.dark,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Transactions section ─────────────────────────────────
  section: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.dark,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterText: {
    fontSize: 12,
    color: colors.placeholder,
    fontWeight: "600",
  },

  txList: { gap: 8, paddingBottom: 8 },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  txItemIncome: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(230,67,38,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  txIconIncome: {
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: "700", color: colors.dark },
  txSub: { fontSize: 12, color: colors.placeholder, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "800" },
});
