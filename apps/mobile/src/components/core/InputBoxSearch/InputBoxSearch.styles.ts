import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const s = StyleSheet.create({
  container: {
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.disabled,
    gap: 10,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  gradientIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 13,
    color: colors.placeholder,
  },
  resultsList: {
    gap: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.placeholder,
    textAlign: "center",
  },

  // ── Overlay (modal) mode styles ──────────────────────────────────────────
  dimOverlay: {
    backgroundColor: colors.darkSemiOpacized,
  },
  modalSearchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  fakePlaceholder: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    color: colors.placeholder,
  },
  resultsModalSpacing: {
    marginTop: 12,
  },

  emptyWrap: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 30,
    marginTop: 12,
  },
});
