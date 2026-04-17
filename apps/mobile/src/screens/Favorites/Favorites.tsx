import React from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { pf } from "./Favorites.styles";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";
import { NavigationEnum } from "../../types/navigation";
import type { Tournament } from "../../types/tournament";
import { UserRole } from "../../constants/user";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import { ButtonGeneric, ButtonIcon } from "../../components/core/Button/Button";
import { colors } from "../../theme/colors";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_LABEL: Record<string, string> = {
  upcoming: "In arrivo",
  ongoing: "In corso",
  completed: "Terminato",
};
const STATUS_COLOR: Record<string, string> = {
  upcoming: colors.purpleBlue,
  ongoing: colors.success,
  completed: colors.grayDark,
};

function TournamentCard({
  item,
  onPress,
  onRemove,
}: {
  item: Tournament;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <ButtonGeneric style={pf.card} handleBtn={onPress}>
      <View style={pf.cardHeader}>
        <View style={pf.cardHeaderLeft}>
          <Text style={pf.cardGame}>{item.game}</Text>
          <Text style={pf.cardName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        <ButtonIcon
          handleBtn={onRemove}
          style={pf.bookmarkBtn}
          icon={
            <Ionicons
              name="bookmark"
              size={20}
              color={colors.primaryGradientMid}
            />
          }
        />
      </View>
      <View style={pf.cardFooter}>
        <View
          style={[
            pf.statusBadge,
            { backgroundColor: STATUS_COLOR[item.status] + "22" },
          ]}
        >
          <Text style={[pf.statusText, { color: STATUS_COLOR[item.status] }]}>
            {STATUS_LABEL[item.status]}
          </Text>
        </View>
        <View style={pf.metaRow}>
          <Ionicons
            name="people-outline"
            size={12}
            color={colors.placeholder}
          />
          <Text style={pf.metaText}>
            {item.currentParticipants}/{item.maxParticipants}
          </Text>
        </View>
        <View style={pf.metaRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.placeholder}
          />
          <Text style={pf.metaText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <Text style={pf.entryFee}>{item.entryFee}</Text>
      </View>
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
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TournamentCard
              item={item}
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
