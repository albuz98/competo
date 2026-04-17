import React from "react";
import { View, Text } from "react-native";
import { styles } from "./CompetoLogo.styles";

export default function CompetoLogo() {
  return (
    <View style={styles.logoArea}>
      <Text style={styles.logoText}>Competo</Text>
      <Text style={styles.logoTagline}>ORGANIZZA. COMPETI. VINCI.</Text>
    </View>
  );
}
