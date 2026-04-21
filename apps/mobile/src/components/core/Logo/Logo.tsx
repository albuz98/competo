import { View, Text, Image } from "react-native";
import { styles } from "./Logo.styled";

export function Logo({
  logoUrl,
  emoji,
  circleSize,
  fontSize,
  style,
}: {
  logoUrl?: string;
  emoji: string;
  circleSize: number;
  fontSize: number;
  style?: object;
}) {
  if (logoUrl) {
    return (
      <View
        style={[
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          },
          style,
          styles.tournamentLogo,
        ]}
      >
        <Image
          source={{ uri: logoUrl }}
          style={{
            width: circleSize - 8,
            height: circleSize - 8,
            borderRadius: (circleSize - 8) / 2,
          }}
          resizeMode="cover"
        />
      </View>
    );
  }
  return <Text style={[{ fontSize }, style]}>{emoji}</Text>;
}
