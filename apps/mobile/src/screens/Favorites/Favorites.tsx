import React from "react";
import { View, Text, FlatList, StatusBar, ImageBackground } from "react-native";
import { pf, CARD_W, CARD_H } from "./Favorites.styles";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";
import { NavigationEnum } from "../../types/navigation";
import type { Tournament } from "../../types/tournament";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { ButtonGeneric, ButtonIcon } from "../../components/core/Button/Button";
import { colorGradient, colors } from "../../theme/colors";
import { SPORT_EMOJI } from "../../constants/generals";
import { UserRole } from "../../types/user";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function TournamentCard({
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

export default function Favorites() {
  const navigation = useNavigation<Nav>();
  const { favorites, removeFavorite } = useFavorites();
  const { currentProfile } = useAuth();
  const insets = useSafeAreaInsets();

  const isOrganizer = currentProfile?.role === UserRole.ORGANIZER;

  return (
    <SafeAreaView style={pf.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Text style={pf.header}>Preferiti</Text>
      {isOrganizer ? (
        <View style={pf.center}>
          <Ionicons name="person-outline" size={64} color={colors.gray} />
          <Text style={pf.emptyTitle}>Profilo organizzatore</Text>
          <Text style={pf.emptySubtitle}>
            Passa al profilo giocatore per vedere i tornei preferiti
          </Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={pf.center}>
          <Ionicons name="bookmark-outline" size={64} color={colors.gray} />
          <Text style={pf.emptyTitle}>Nessun preferito</Text>
          <Text style={pf.emptySubtitle}>
            Aggiungi tornei ai preferiti per trovarli facilmente
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 20,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TournamentCard
              item={item}
              index={index}
              onPress={() =>
                navigation.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
                  tournamentId: item.id,
                })
              }
              onRemove={() => removeFavorite(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
