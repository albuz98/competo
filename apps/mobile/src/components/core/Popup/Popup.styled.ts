import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cardWarning: {
    backgroundColor: colors.warningBg,
    borderWidth: 1.5,
    borderColor: colors.warningBorder,
  },
  cardNeutral: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.disabled,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },
  titleWarning: {
    color: colors.warningText,
  },
  titleNeutral: {
    color: colors.dark,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
  },
  messageWarning: {
    color: colors.warningText,
  },
  messageNeutral: {
    color: colors.placeholder,
  },
  divider: {
    height: 1,
    backgroundColor: colors.disabled,
    marginBottom: 12,
  },
  dividerWarning: {
    backgroundColor: colors.warningBorder,
  },
  okButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 10,
  },
  okButtonWarning: {
    backgroundColor: colors.warningBorder,
  },
  okButtonNeutral: {
    backgroundColor: colors.gray,
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  okButtonTextWarning: {
    color: colors.warningText,
  },
  okButtonTextNeutral: {
    color: colors.dark,
  },
});
