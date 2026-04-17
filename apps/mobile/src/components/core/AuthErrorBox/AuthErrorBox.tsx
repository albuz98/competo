import React from "react";
import { View, Text } from "react-native";
import { styles } from "./AuthErrorBox.styles";

type Props = { message: string };

export default function AuthErrorBox({ message }: Props) {
  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}
