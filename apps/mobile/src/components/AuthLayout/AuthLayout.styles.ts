import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  safeArea: { flex: 1 },
  container: {
    height: 580,
  },
  topArea: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    right: 24,
    top: 16,
    backgroundColor: colors.primaryGradientMidOpacized,
    paddingTop: 5,
    paddingBottom: 5,
  },
  card: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  cardContent: { padding: 28, paddingBottom: 40, flexGrow: 1 },
});
