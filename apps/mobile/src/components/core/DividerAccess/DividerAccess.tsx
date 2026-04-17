import { Text, View } from "react-native";
import { styles } from "./DividerAccess.styles";

export function DividerAccess() {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>o</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}
