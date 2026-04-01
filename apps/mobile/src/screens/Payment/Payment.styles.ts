import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  safeArea: { flex: 1 },
  flex: { flex: 1 },

  topArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  backArrow: { color: colors.white, fontSize: 20, lineHeight: 24 },
  backText: { color: colors.white, fontSize: 15, fontWeight: "500" },

  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  cardContent: { padding: 28, flexGrow: 1 },

  cardTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },

  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  teamBadgeText: { color: colors.white, fontWeight: "700", fontSize: 12 },
  feeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 20,
  },
  feeText: {
    color: colors.primaryGradientMid,
    fontWeight: "800",
    fontSize: 16,
  },

  methodRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  methodBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  methodBtnActive: { backgroundColor: colors.white },
  methodBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
  },
  methodBtnTextActive: { color: colors.primaryGradientMid },

  errorBox: {
    backgroundColor: colors.opacized,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.white, fontSize: 13, textAlign: "center" },

  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.white,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  splitRow: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 20,
  },
  secureText: { color: "rgba(255,255,255,0.6)", fontSize: 12 },

  logoArea: { alignItems: "center", marginTop: 8 },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
    fontStyle: "italic",
  },
  logoTagline: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
    marginTop: 2,
  },

  closeBtn: {
    position: "absolute",
    right: 24,
    top: 16,
    backgroundColor: colors.primaryGradientMidOpacized,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
