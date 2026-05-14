import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { pf } from "./StatsOrganizer.styled";

export const StatsOrganizer = () => {
  return (
    <SafeAreaView style={pf.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
    </SafeAreaView>
  );
};
