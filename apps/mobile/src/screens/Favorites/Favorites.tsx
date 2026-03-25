import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { pf } from "./Favorites.styles";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, Tournament } from "../../types";
import { useFavorites } from "../../context/FavoritesContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_LABEL: Record<string, string> = {
  upcoming: "In arrivo",
  ongoing: "In corso",
  completed: "Terminato",
};
const STATUS_COLOR: Record<string, string> = {
  upcoming: "#3b82f6",
  ongoing: "#10b981",
  completed: "#6b7280",
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
    <TouchableOpacity style={pf.card} onPress={onPress} activeOpacity={0.85}>
      <View style={pf.cardHeader}>
        <View style={pf.cardHeaderLeft}>
          <Text style={pf.cardGame}>{item.game}</Text>
          <Text style={pf.cardName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        <TouchableOpacity
          style={pf.bookmarkBtn}
          onPress={onRemove}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="bookmark" size={20} color="#E8601A" />
        </TouchableOpacity>
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
          <Ionicons name="people-outline" size={12} color="#94a3b8" />
          <Text style={pf.metaText}>
            {item.currentParticipants}/{item.maxParticipants}
          </Text>
        </View>
        <View style={pf.metaRow}>
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <Text style={pf.metaText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        <Text style={pf.entryFee}>{item.entryFee}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Favorites() {
  const navigation = useNavigation<Nav>();
  const { favorites, removeFavorite } = useFavorites();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={pf.root} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={pf.header}>Preferiti</Text>
      {favorites.length === 0 ? (
        <View style={pf.center}>
          <Ionicons name="bookmark-outline" size={64} color="#e2e8f0" />
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
                navigation.navigate("TournamentDetail", {
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
