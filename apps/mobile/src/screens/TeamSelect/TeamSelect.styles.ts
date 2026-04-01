import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const ts = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 32,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  scrollContent: { padding: 16, gap: 10 },

  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  teamCardSelected: {
    borderColor: colors.primaryGradientMid,
    backgroundColor: "#FFFBF8",
  },

  teamAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  teamAvatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  teamName: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  teamMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: colors.primaryGradientMid,
    borderColor: colors.primaryGradientMid,
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#94a3b8",
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 20,
  },

  createTeamBtn: {
    marginTop: 4,
    backgroundColor: colors.primaryGradientMid,
    borderRadius: 50,
    paddingVertical: 13,
    paddingHorizontal: 28,
  },
  createTeamBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  bottomBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 10,
  },
});
