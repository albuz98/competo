import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { styles } from "./HomeOrganizer.styled";

export const HomeOrganizer = () => {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
    </SafeAreaView>
  );
};
