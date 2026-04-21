import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const fps = StyleSheet.create({
  sliderWrapper: {
    marginTop: 4,
    marginBottom: 8,
  },
  sliderLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sliderRangeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.grayDark,
  },
  sliderRangeLabelActive: {
    color: colors.primaryGradientMid,
  },
  sliderTrackOuter: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.disabled,
  },
  sliderTrackFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: colors.primaryGradientMid,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    top: -10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.primaryGradientMid,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderEndLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  sliderEndLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.grayDark,
  },
});
