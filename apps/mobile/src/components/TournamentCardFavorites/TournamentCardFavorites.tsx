import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, ImageBackground, Text } from "react-native";
import { SPORT_EMOJI } from "../../constants/generals";
import { colors, colorGradient } from "../../theme/colors";
import { Tournament } from "../../types/tournament";
import { ButtonIcon, ButtonGeneric } from "../core/Button/Button";
import { Ionicons } from "@expo/vector-icons";
import { CARD_H, CARD_W, pf } from "./TournamentCardFavorites.styled";

export function TournamentCardFavorites({
  item,
  onPress,
  onRemove,
}: {
  item: Tournament;
  index: number;
  onPress: () => void;
  onRemove: () => void;
}) {
  const emoji = SPORT_EMOJI[item.game] ?? "🏆";
  const date = new Date(item.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const inner = (
    <View style={pf.whiteOverlay}>
      <View style={pf.bigCardDecor} />
      <Text style={pf.bigCardEmoji}>{emoji}</Text>
      <ButtonIcon
        handleBtn={onRemove}
        style={pf.bookmarkBtn}
        icon={
          <Ionicons
            name="bookmark"
            size={18}
            color={colors.primaryGradientMid}
          />
        }
      />
      <View style={pf.bigCardOverlay}>
        <Text style={pf.bigCardName} numberOfLines={1}>
          {item.name.toUpperCase()} – {date}
        </Text>
        <View style={pf.bigCardLocation}>
          <View style={pf.cardMetaItem}>
            <Ionicons name="location-sharp" size={11} color={colors.dark} />
            <Text style={pf.bigCardLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <Text style={pf.cardFee}>{item.entryFee}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ButtonGeneric
      style={[pf.bigCard, { width: CARD_W, height: CARD_H }]}
      handleBtn={onPress}
    >
      {item.imageUrl ? (
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={pf.bigCardGradient}
          resizeMode="cover"
        >
          {inner}
        </ImageBackground>
      ) : (
        <LinearGradient colors={colorGradient} style={pf.bigCardGradient}>
          {inner}
        </LinearGradient>
      )}
    </ButtonGeneric>
  );
}
