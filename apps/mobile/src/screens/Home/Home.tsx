import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type {
  RootStackParamList,
  MainTabParamList,
} from "../../types/navigation";
import { NavigationEnum } from "../../types/navigation";
import { useAuth } from "../../context/AuthContext";
import { getMyTournamentsCache } from "../../api/tournaments";
import { styles, BIG_W, BIG_H, SMALL_W } from "../../screens/Home/Home.styles";
import {
  ButtonFullColored,
  ButtonGeneric,
} from "../../components/core/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { colors } from "../../theme/colors";
import { CARD_GRADIENTS, SPORT_EMOJI } from "../../constants/generals";
import { InputBoxSearch } from "../../components/core/InputBoxSearch/InputBoxSearch";
import { generateTournaments } from "../../mock/tournaments";
import { MyTournament, Tournament } from "../../types/tournament";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

// Shared cache so MyTournamentDetailScreen finds the same IDs
const MY_ALL_TOURNAMENTS: MyTournament[] = getMyTournamentsCache();
const MY_PARTICIPANT_TOURNAMENTS = MY_ALL_TOURNAMENTS.filter(
  (t) => !t.isOrganizer,
);
const RECOMMENDED = generateTournaments(6);

// ─── Big card (I Tuoi Tornei) ────────────────────────────────────────────────
function BigCard({
  tournament,
  index,
  onPress,
}: {
  tournament: Tournament;
  index: number;
  onPress: () => void;
}) {
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
        <Text style={styles.bigCardEmoji}>{emoji}</Text>
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

// ─── Small card (Consigliati) ────────────────────────────────────────────────
function SmallCard({
  tournament,
  index,
  onPress,
}: {
  tournament: Tournament;
  index: number;
  onPress: () => void;
}) {
  const colorsGrad = CARD_GRADIENTS[(index + 2) % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <View style={[styles.smallCard, { width: SMALL_W }]}>
      <LinearGradient colors={colorsGrad} style={styles.smallCardTop}>
        <Text style={styles.smallCardEmoji}>{emoji}</Text>
      </LinearGradient>
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

// ─── Main screen ─────────────────────────────────────────────────────────────
const searchTournaments = (q: string): Promise<Tournament[]> => {
  const lower = q.toLowerCase();
  return Promise.resolve(
    RECOMMENDED.filter(
      (t) =>
        t.name.toLowerCase().includes(lower) ||
        t.location.toLowerCase().includes(lower),
    ),
  );
};

export default function Home() {
  const { user } = useAuth();
  const navigation = useNavigation<HomeNavProp>();
  const goToDetail = (id: string) => {
    if (!user) {
      navigation.navigate(NavigationEnum.LOGIN, {
        redirect: "tournament",
        tournamentId: id,
      });
    } else {
      navigation.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
        tournamentId: id,
      });
    }
  };

  const goToMyTournament = (id: string) => {
    if (!user) {
      navigation.navigate(NavigationEnum.LOGIN, {
        redirect: "tournament",
        tournamentId: id,
      });
    } else {
      navigation.navigate(NavigationEnum.MY_TOURNAMENT_DETAIL, {
        tournamentId: id,
      });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* ── Search ──────────────────────────────── */}
        <View style={styles.searchWrap}>
          <InputBoxSearch<Tournament>
            placeholder="Cerca tornei..."
            gradientIcon
            overlayDropdown
            onSearch={searchTournaments}
            emptyMessage="Nessun torneo trovato"
            onSelect={(t) => goToDetail(t.id)}
            renderResult={(t, index, onPress) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={onPress}
              >
                <Text style={styles.searchResultName} numberOfLines={1}>
                  {t.name}
                </Text>
                <View style={styles.searchResultMeta}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={colors.placeholder}
                  />
                  <Text style={styles.searchResultLocation} numberOfLines={1}>
                    {t.location}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── I Tuoi Tornei ───────────────────────── */}
          {MY_PARTICIPANT_TOURNAMENTS.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Tornei in corso
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hList}
              >
                {MY_PARTICIPANT_TOURNAMENTS.map((t, i) => (
                  <BigCard
                    key={t.id}
                    tournament={t}
                    index={i}
                    onPress={() => goToMyTournament(t.id)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* ── Consigliati per te ──────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Consigliati per te
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {RECOMMENDED.map((t, i) => (
              <SmallCard
                key={t.id}
                tournament={t}
                index={i}
                onPress={() => goToDetail(t.id)}
              />
            ))}
          </ScrollView>

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
