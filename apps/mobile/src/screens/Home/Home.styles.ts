import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../theme/colors";

const { width: SW } = Dimensions.get("window");
export const BIG_W = SW * 0.72;
export const BIG_H = 200;
export const SMALL_W = SW * 0.42;

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  safeArea: { flex: 1 },
  scroll: { paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  greetingBlock: { flex: 1, display: "flex", flexDirection: "column" },
  greetingText: { fontSize: 18, fontWeight: "800", color: colors.dark },
  locationRow: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    marginTop: 5,
    justifyContent: "flex-start",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.opacized,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 6,
  },
  modalSub: { fontSize: 13, color: colors.placeholder, marginBottom: 20 },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.grayDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  modalInput: { flex: 1, fontSize: 15, color: colors.dark },
  modalBtns: { flexDirection: "row", gap: 12 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  searchWrap: {
    marginHorizontal: 16,
    marginTop: 40,
    marginBottom: 10,
  },
  searchResultItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.disabled,
    gap: 4,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
  },
  searchResultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  searchResultLocation: {
    fontSize: 12,
    color: colors.placeholder,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.dark,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hList: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },

  bigCard: { borderRadius: 18, overflow: "hidden" },
  bigCardGradient: { flex: 1, justifyContent: "flex-end" },
  bigCardDecor: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.darkOpacized,
  },
  bigCardEmoji: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    fontSize: 56,
    marginTop: -40,
  },
  bigCardOverlay: {
    backgroundColor: colors.grayOpacized,
    borderRadius: 12,
    margin: 10,
    padding: 10,
  },
  bigCardName: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.dark,
    letterSpacing: 0.2,
  },
  bigCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  bigCardLocationText: { fontSize: 11, color: colors.placeholder },

  smallCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 15,
  },
  smallCardTop: {
    height: SMALL_W * 0.85,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  smallCardEmoji: { fontSize: 44 },
  smallCardBody: { padding: 10 },
  smallCardName: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.dark,
    marginBottom: 4,
  },
  smallCardRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  smallCardMeta: { fontSize: 10, color: colors.placeholder, flex: 1 },
});
