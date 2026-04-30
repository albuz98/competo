import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.dark,
  },
  containerHeaderText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backBtn: {
    marginRight: 4,
  },
});
