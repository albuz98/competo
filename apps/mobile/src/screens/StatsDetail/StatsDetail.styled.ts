import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const sd = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },

  // ── Gradient header ──────────────────────────────────────
  header: {
    paddingBottom: 24,
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
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Header summary ───────────────────────────────────────
  headerSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 12,
  },
  viewsLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 2,
  },
  viewsCount: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.white,
  },
  viewsSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  promuoviBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  promuoviText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
  },
  deltaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(217,26,26,0.3)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginLeft: 24,
  },
  deltaText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: "600",
  },

  // ── Content area ─────────────────────────────────────────
  content: {
    flex: 1,
    backgroundColor: colors.gray,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },

  // ── Chart card ───────────────────────────────────────────
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.dark,
  },
  cardSubTitle: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 2,
  },
  periodBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  periodText: {
    fontSize: 12,
    color: colors.placeholder,
    fontWeight: "600",
  },
  chartBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  legend: { flex: 1, gap: 10 },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  legendText: { flex: 1 },
  legendLabel: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: "600",
  },
  legendCount: {
    fontSize: 11,
    color: colors.placeholder,
  },
  legendPct: {
    fontSize: 12,
    color: colors.grayDark,
    fontWeight: "700",
    minWidth: 38,
    textAlign: "right",
  },

  // ── Metrics section ──────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.dark,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  metricTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.placeholder,
    fontWeight: "500",
    flex: 1,
    marginRight: 4,
  },
  deltaUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  deltaDown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(217,26,26,0.1)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  metricDelta: {
    fontSize: 10,
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.dark,
  },
});
