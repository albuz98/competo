import React, { useState } from "react";
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
import { TOURNAMENT_GENDERS } from "../../constants/tournament";
import { InputBoxSearch } from "../../components/core/InputBoxSearch/InputBoxSearch";
import { generateTournaments } from "../../mock/tournaments";
import { MyTournament, Tournament } from "../../types/tournament";
import { FilterPanel } from "../../components/FilterPanel/FilterPanel";
import { FilterState, SortOption } from "../../types/filters";
import { PRICE_MAX } from "../../constants/filters";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

// Shared cache so MyTournamentDetailScreen finds the same IDs
const MY_ALL_TOURNAMENTS: MyTournament[] = getMyTournamentsCache();
const MY_PARTICIPANT_TOURNAMENTS = MY_ALL_TOURNAMENTS.filter(
  (t) => !t.isOrganizer,
);
const ALL_TOURNAMENTS = generateTournaments(12);
const RECOMMENDED = ALL_TOURNAMENTS.slice(0, 6);

// ─── Filter helpers ───────────────────────────────────────────────────────────

const EMPTY_FILTERS: FilterState = {
  games: [],
  genders: [],
  minPrice: 0,
  maxPrice: PRICE_MAX,
  sortBy: null,
};

const ENTRY_FEE_ORDER: Record<string, number> = {
  Free: 0,
  $10: 10,
  $25: 25,
  $50: 50,
  $100: 100,
};

function applyFilters(
  tournaments: Tournament[],
  filters: FilterState,
): Tournament[] {
  let result = [...tournaments];

  if (filters.games.length > 0) {
    result = result.filter((t) => filters.games.includes(t.game));
  }
  if (filters.genders.length > 0) {
    result = result.filter(
      (t) => t.gender && filters.genders.includes(t.gender),
    );
  }
  const priceFiltered = filters.minPrice > 0 || filters.maxPrice < PRICE_MAX;
  if (priceFiltered) {
    result = result.filter((t) => {
      const fee = ENTRY_FEE_ORDER[t.entryFee] ?? 0;
      return fee >= filters.minPrice && fee <= filters.maxPrice;
    });
  }
  if (filters.sortBy === "price_asc") {
    result.sort(
      (a, b) =>
        (ENTRY_FEE_ORDER[a.entryFee] ?? 0) - (ENTRY_FEE_ORDER[b.entryFee] ?? 0),
    );
  } else if (filters.sortBy === "price_desc") {
    result.sort(
      (a, b) =>
        (ENTRY_FEE_ORDER[b.entryFee] ?? 0) - (ENTRY_FEE_ORDER[a.entryFee] ?? 0),
    );
  }
  // distance sort deferred to real API integration

  return result;
}

interface ActiveChip {
  key: string;
  label: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.DISTANCE]: "Distanza",
  [SortOption.PRICE_ASC]: "Prezzo ↑",
  [SortOption.PRICE_DESC]: "Prezzo ↓",
};

function getActiveChips(filters: FilterState): ActiveChip[] {
  const chips: ActiveChip[] = [];
  filters.games.forEach((g) => chips.push({ key: `game:${g}`, label: g }));
  filters.genders.forEach((g) => {
    const item = TOURNAMENT_GENDERS.find((tg) => tg.value === g);
    if (item) chips.push({ key: `gender:${g}`, label: item.label });
  });
  if (filters.minPrice > 0 || filters.maxPrice < PRICE_MAX) {
    const minLabel = filters.minPrice === 0 ? "Gratis" : `${filters.minPrice}€`;
    const maxLabel =
      filters.maxPrice >= PRICE_MAX ? "Max" : `${filters.maxPrice}€`;
    chips.push({ key: "price", label: `${minLabel} – ${maxLabel}` });
  }
  if (filters.sortBy) {
    chips.push({
      key: `sort:${filters.sortBy}`,
      label: SORT_LABELS[filters.sortBy],
    });
  }
  return chips;
}

function removeChip(filters: FilterState, key: string): FilterState {
  const colonIdx = key.indexOf(":");
  const type = key.slice(0, colonIdx);
  const value = key.slice(colonIdx + 1);

  switch (type) {
    case "game":
      return { ...filters, games: filters.games.filter((g) => g !== value) };
    case "gender":
      return {
        ...filters,
        genders: filters.genders.filter((g) => (g as string) !== value),
      };
    case "price":
      return { ...filters, minPrice: 0, maxPrice: PRICE_MAX };
    case "sort":
      return { ...filters, sortBy: null };
    default:
      return filters;
  }
}

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

// ─── Vertical card (risultati filtrati) ──────────────────────────────────────
function VerticalCard({
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
    <ButtonGeneric style={styles.vCard} handleBtn={onPress}>
      <LinearGradient colors={colorsGrad} style={styles.vCardGradient}>
        <Text style={styles.vCardEmoji}>{emoji}</Text>
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
            <Ionicons
              name="cash-outline"
              size={12}
              color={colors.grayOpacized}
            />
            <Text style={styles.vCardMeta}>
              {tournament.entryFee} · {date}
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.grayOpacized}
        />
      </LinearGradient>
    </ButtonGeneric>
  );
}

// ─── Search fn ───────────────────────────────────────────────────────────────
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

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function Home() {
  const { user } = useAuth();
  const navigation = useNavigation<HomeNavProp>();
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<FilterState>(EMPTY_FILTERS);

  const hasActiveFilters =
    activeFilters.games.length > 0 ||
    activeFilters.genders.length > 0 ||
    activeFilters.minPrice > 0 ||
    activeFilters.maxPrice < PRICE_MAX ||
    activeFilters.sortBy !== null;

  const displayedTournaments = hasActiveFilters
    ? applyFilters(ALL_TOURNAMENTS, activeFilters)
    : [];

  const activeChips = getActiveChips(activeFilters);

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

  const handleRemoveChip = (key: string) => {
    setActiveFilters((f) => removeChip(f, key));
  };

  const handleClearAll = () => setActiveFilters(EMPTY_FILTERS);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* ── Search + Filter button ──────────────────── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputWrap}>
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
          <TouchableOpacity
            style={[
              styles.filterBtn,
              hasActiveFilters && styles.filterBtnActive,
            ]}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={hasActiveFilters ? colors.primaryGradientMid : colors.dark}
            />
            {hasActiveFilters && <View style={styles.filterBtnDot} />}
          </TouchableOpacity>
        </View>

        {/* ── Active filter chips bar ─────────────────── */}
        {hasActiveFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsBar}
            contentContainerStyle={styles.chipsBarContent}
          >
            {activeChips.map((chip) => (
              <TouchableOpacity
                key={chip.key}
                style={styles.activeChip}
                onPress={() => handleRemoveChip(chip.key)}
                activeOpacity={0.8}
              >
                <Text style={styles.activeChipText}>{chip.label}</Text>
                <View style={styles.activeChipClose}>
                  <Ionicons name="close" size={10} color={colors.white} />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClearAll}
              activeOpacity={0.8}
            >
              <Text style={styles.clearBtnText}>Elimina filtri</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            hasActiveFilters ? styles.scrollFiltered : styles.scroll
          }
        >
          {hasActiveFilters ? (
            /* ── Risultati filtrati ─────────────────── */
            <>
              <Text style={styles.filteredHeader}>
                {displayedTournaments.length}{" "}
                {displayedTournaments.length === 1 ? "torneo" : "tornei"}{" "}
                trovati
              </Text>
              {displayedTournaments.length === 0 ? (
                <View style={styles.filteredEmpty}>
                  <Ionicons
                    name="search-outline"
                    size={40}
                    color={colors.grayDark}
                  />
                  <Text style={styles.filteredEmptyText}>
                    Nessun torneo corrisponde ai filtri selezionati
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  {displayedTournaments.map((t, i) => (
                    <VerticalCard
                      key={t.id}
                      tournament={t}
                      index={i}
                      onPress={() => goToDetail(t.id)}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            /* ── Home normale ───────────────────────── */
            <>
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
            </>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Filter panel overlay ────────────────────── */}
      <FilterPanel
        visible={filterVisible}
        filters={activeFilters}
        onClose={() => setFilterVisible(false)}
        onApply={(f) => {
          setActiveFilters(f);
          setFilterVisible(false);
        }}
      />
    </View>
  );
}
