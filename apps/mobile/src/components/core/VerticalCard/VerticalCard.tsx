import { LinearGradient } from "expo-linear-gradient";
import { ButtonGeneric } from "../Button/Button";
import { View, Text, ImageBackground } from "react-native";
import { Tournament } from "../../../types/tournament";
import { CARD_GRADIENTS, SPORT_EMOJI } from "../../../constants/generals";
import { Ionicons } from "@expo/vector-icons";
import { Logo } from "../Logo/Logo";
import { styles } from "./VerticalCard.styled";
import { colorGradient, colors } from "../../../theme/colors";
import { SMALL_W } from "../../../screens/Home/Home.styles";

interface VerticalCardProps {
  tournament: Tournament;
  index: number;
  onPress: () => void;
}

export function VerticalCard({
  tournament,
  index,
  onPress,
}: VerticalCardProps) {
  const colorsGrad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  const inner = (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        width: "100%",
        height: SMALL_W,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        justifyContent: "flex-end",
        borderRadius: 16,
        paddingHorizontal: 16,
      }}
    >
      <Logo
        logoUrl={tournament.logoUrl}
        emoji={emoji}
        circleSize={50}
        fontSize={34}
      />
      <View style={styles.vCardContent}>
        <Text style={styles.vCardName} numberOfLines={1}>
          {tournament.name}
        </Text>
        <View style={styles.vCardRow}>
          <Ionicons
            name="location-sharp"
            size={12}
            color={colors.grayOpacized}
          />
          <Text style={styles.vCardMeta} numberOfLines={1}>
            {tournament.location}
          </Text>
        </View>
        <View style={styles.vCardRow}>
          <Ionicons name="cash-outline" size={12} color={colors.grayOpacized} />
          <Text style={styles.vCardMeta}>
            {tournament.entryFee} · {date}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.grayOpacized} />
    </View>
  );

  return (
    <ButtonGeneric style={styles.vCard} handleBtn={onPress}>
      {tournament.imageUrl ? (
        <ImageBackground
          source={{ uri: tournament.imageUrl }}
          style={styles.vCardGradient}
          resizeMode="cover"
        >
          {inner}
        </ImageBackground>
      ) : (
        <LinearGradient colors={colorGradient} style={styles.vCardGradient}>
          {inner}
        </LinearGradient>
      )}
    </ButtonGeneric>
  );
}
