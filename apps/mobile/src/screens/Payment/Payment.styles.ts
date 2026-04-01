import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  safeArea: { flex: 1 },
  flex: { flex: 1 },

  topArea: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },

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
    color: colors.grayOpacized,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },

  teamBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.opacized,
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

  errorBox: {
    backgroundColor: colors.opacized,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.white, fontSize: 13, textAlign: "center" },

  label: {
    color: colors.grayOpacized,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 4,
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
  secureText: { color: colors.grayOpacized, fontSize: 12 },

  logoArea: { alignItems: "center", marginTop: 8 },
  logoText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
    fontStyle: "italic",
  },
  logoTagline: {
    color: colors.grayOpacized,
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
