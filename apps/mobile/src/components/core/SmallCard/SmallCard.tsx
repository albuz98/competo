import { View, Text, ImageBackground } from "react-native";
import { CARD_GRADIENTS, SPORT_EMOJI } from "../../../constants/generals";
import { Tournament } from "../../../types/tournament";
import { LinearGradient } from "expo-linear-gradient";
import { ButtonFullColored } from "../Button/Button";
import { sizesEnum } from "../../../theme/dimension";
import { Ionicons } from "@expo/vector-icons";
import { colorGradient, colors } from "../../../theme/colors";
import { Logo } from "../Logo/Logo";
import { SMALL_W } from "../../../screens/Home/Home.styles";
import { styles } from "./SmallCard.styled";

interface SmallCardProps {
  tournament: Tournament;
  index: number;
  onPress: () => void;
}

export function SmallCard({ tournament, index, onPress }: SmallCardProps) {
  const colorsGrad = CARD_GRADIENTS[(index + 2) % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  const topInner = (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        width: SMALL_W,
        height: SMALL_W * 0.85,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
    >
      <Logo
        logoUrl={tournament.logoUrl}
        emoji={emoji}
        circleSize={70}
        fontSize={44}
      />
    </View>
  );

  return (
    <View style={[styles.smallCard, { width: SMALL_W }]}>
      {tournament.imageUrl ? (
        <ImageBackground
          source={{ uri: tournament.imageUrl }}
          style={styles.smallCardTop}
          resizeMode="cover"
        >
          {topInner}
        </ImageBackground>
      ) : (
        <LinearGradient colors={colorGradient} style={styles.smallCardTop}>
          {topInner}
        </LinearGradient>
      )}
      <View style={styles.smallCardBody}>
        <Text style={styles.smallCardName} numberOfLines={1}>
          {tournament.game.toUpperCase()} – {date}
        </Text>
        <View style={styles.smallCardRow}>
          <Ionicons
            name="location-sharp"
            size={10}
            color={colors.placeholder}
          />
          <Text style={styles.smallCardMeta} numberOfLines={1}>
            {" "}
            {tournament.location}
          </Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons
            name="people-outline"
            size={10}
            color={colors.placeholder}
          />
          <Text style={styles.smallCardMeta}>
            {" "}
            {tournament.currentParticipants}/{tournament.maxParticipants}{" "}
            squadre
          </Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons name="cash-outline" size={10} color={colors.placeholder} />
          <Text style={styles.smallCardMeta}> {tournament.entryFee}</Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons
            name="trophy-outline"
            size={10}
            color={colors.placeholder}
          />
          <Text style={styles.smallCardMeta}> {tournament.prizePool}</Text>
        </View>
        <ButtonFullColored
          text="VEDI ALTRO"
          handleBtn={onPress}
          size={sizesEnum.small}
          isColored
        />
      </View>
    </View>
  );
}
