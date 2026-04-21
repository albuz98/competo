import { LinearGradient } from "expo-linear-gradient";
import { CARD_GRADIENTS, SPORT_EMOJI } from "../../../constants/generals";
import { BIG_H, BIG_W } from "../../../screens/Home/Home.styles";
import { Tournament } from "../../../types/tournament";
import { ButtonGeneric } from "../Button/Button";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { Logo } from "../Logo/Logo";
import { styles } from "./BigCard.styled";
import { colors } from "../../../theme/colors";

interface BigCardProps {
  tournament: Tournament;
  index: number;
  onPress: () => void;
}

export function BigCard({ tournament, index, onPress }: BigCardProps) {
  const colorsGrad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <ButtonGeneric
      style={[styles.bigCard, { width: BIG_W, height: BIG_H }]}
      handleBtn={onPress}
    >
      <LinearGradient colors={colorsGrad} style={styles.bigCardGradient}>
        <View style={styles.bigCardDecor} />
        <Logo
          logoUrl={tournament.logoUrl}
          emoji={emoji}
          circleSize={75}
          fontSize={56}
          style={styles.bigCardEmoji}
        />
        <View style={styles.bigCardOverlay}>
          <Text style={styles.bigCardName} numberOfLines={1}>
            {tournament.name.toUpperCase()} – {date}
          </Text>
          <View style={styles.bigCardLocation}>
            <Ionicons
              name="location-sharp"
              size={11}
              color={colors.placeholder}
            />
            <Text style={styles.bigCardLocationText} numberOfLines={1}>
              {tournament.location}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ButtonGeneric>
  );
}
