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
import { useFavorites } from "../../context/FavoritesContext";
import { colors } from "../../theme/colors";
import { TournamentCardFavorites } from "../../components/TournamentCardFavorites/TournamentCardFavorites";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function Favorites() {
  const navigation = useNavigation<Nav>();
  const { favorites, removeFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={pf.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Text style={pf.header}>Preferiti</Text>
      {favorites.length === 0 ? (
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
          keyExtractor={(t) => String(t.id)}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 20,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TournamentCardFavorites
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
