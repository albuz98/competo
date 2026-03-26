import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
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
  Tournament,
  MainTabParamList,
} from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { generateTournaments } from "../../mock/data";
import { getMyTournamentsCache } from "../../api/tournaments";
import type { MyTournament } from "../../types";
import {
  styles,
  BIG_W,
  BIG_H,
  SMALL_W,
} from "../../screens/Home/Home.styles";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

const SPORT_EMOJI: Record<string, string> = {
  Calcio: "⚽",
  Basket: "🏀",
  Pallavolo: "🏐",
  Tennis: "🎾",
  Padel: "🏸",
  Rugby: "🏉",
  "Ping Pong": "🏓",
  "Calcio a 5": "⚽",
  "Beach Volley": "🏐",
  Badminton: "🏸",
};

const CARD_GRADIENTS: [string, string][] = [
  ["#0D2B5E", "#1E4B9A"],
  ["#0B3D25", "#1A6B45"],
  ["#5C0D0D", "#A02020"],
  ["#2D0B5C", "#5A1BA0"],
  ["#0B3045", "#1A5C80"],
  ["#3D2B0B", "#8B6020"],
];

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
  const colors = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <TouchableOpacity
      style={[styles.bigCard, { width: BIG_W, height: BIG_H }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient colors={colors} style={styles.bigCardGradient}>
        <View style={styles.bigCardDecor} />
        <Text style={styles.bigCardEmoji}>{emoji}</Text>
        <View style={styles.bigCardOverlay}>
          <Text style={styles.bigCardName} numberOfLines={1}>
            {tournament.name.toUpperCase()} – {date}
          </Text>
          <View style={styles.bigCardLocation}>
            <Ionicons name="location-sharp" size={11} color="#64748b" />
            <Text style={styles.bigCardLocationText} numberOfLines={1}>
              {tournament.location}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
  const colors = CARD_GRADIENTS[(index + 2) % CARD_GRADIENTS.length];
  const emoji = SPORT_EMOJI[tournament.game] ?? "🏆";
  const date = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <View style={[styles.smallCard, { width: SMALL_W }]}>
      <LinearGradient colors={colors} style={styles.smallCardTop}>
        <Text style={styles.smallCardEmoji}>{emoji}</Text>
      </LinearGradient>
      <View style={styles.smallCardBody}>
        <Text style={styles.smallCardName} numberOfLines={1}>
          {tournament.game.toUpperCase()} – {date}
        </Text>
        <View style={styles.smallCardRow}>
          <Ionicons name="location-sharp" size={10} color="#94a3b8" />
          <Text style={styles.smallCardMeta} numberOfLines={1}>
            {" "}
            {tournament.location}
          </Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons name="people-outline" size={10} color="#94a3b8" />
          <Text style={styles.smallCardMeta}>
            {" "}
            {tournament.currentParticipants}/{tournament.maxParticipants}{" "}
            squadre
          </Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons name="cash-outline" size={10} color="#94a3b8" />
          <Text style={styles.smallCardMeta}> {tournament.entryFee}</Text>
        </View>
        <View style={styles.smallCardRow}>
          <Ionicons name="trophy-outline" size={10} color="#94a3b8" />
          <Text style={styles.smallCardMeta}> {tournament.prizePool}</Text>
        </View>
        <TouchableOpacity
          style={styles.vediAltroBtn}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.vediAltroText}>VEDI ALTRO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function Home() {
  const { user, location, updateLocation } = useAuth();
  const { unreadCount } = useNotifications();
  const navigation = useNavigation<HomeNavProp>();
  const [search, setSearch] = useState("");
  const [locationModal, setLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const initial =
    user?.firstName?.[0]?.toUpperCase() ??
    user?.username?.[0]?.toUpperCase() ??
    "U";
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : (user?.username ?? "Utente");

  const saveLocation = () => {
    if (locationInput.trim()) {
      updateLocation(locationInput.trim());
    }
    setLocationModal(false);
    setLocationInput("");
  };

  const goToDetail = (id: string) => {
    if (!user) {
      navigation.navigate("Login", {
        redirect: "tournament",
        tournamentId: id,
      });
    } else {
      navigation.navigate("TournamentDetail", { tournamentId: id });
    }
  };

  const goToMyTournament = (id: string) => {
    if (!user) {
      navigation.navigate("Login", {
        redirect: "tournament",
        tournamentId: id,
      });
    } else {
      navigation.navigate("MyTournamentDetail", { tournamentId: id });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* ── Header ──────────────────────────────── */}
          <View style={styles.header}>
            {user?.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={["#E8601A", "#F5A020"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initial}</Text>
              </LinearGradient>
            )}
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingText}>{displayName}</Text>
              <TouchableOpacity
                style={styles.locationRow}
                onPress={() => {
                  if (location) {
                    navigation.navigate("Esplora");
                  } else {
                    setLocationModal(true);
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="location-sharp" size={12} color="#E8601A" />
                <Text
                  style={[
                    styles.locationText,
                    !location && styles.locationPlaceholder,
                  ]}
                >
                  {location ?? "Inserisci posizione"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Notifiche")}
            >
              <LinearGradient
                colors={["#E8601A", "#F5A020"]}
                style={styles.notifBtn}
              >
                <Ionicons name="notifications" size={20} color="#fff" />
                {unreadCount > 0 && <View style={styles.notifBadge} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── Location Modal ───────────────────────── */}
          <Modal
            visible={locationModal}
            transparent
            animationType="fade"
            onRequestClose={() => setLocationModal(false)}
          >
            <KeyboardAvoidingView
              style={styles.modalOverlay}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>La tua posizione</Text>
                <Text style={styles.modalSub}>
                  Inserisci la tua città per trovare tornei vicino a te
                </Text>
                <View style={styles.modalInputRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color="#E8601A"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Es. Milano, Roma..."
                    placeholderTextColor="#94a3b8"
                    value={locationInput}
                    onChangeText={setLocationInput}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={saveLocation}
                  />
                </View>
                <View style={styles.modalBtns}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => {
                      setLocationModal(false);
                      setLocationInput("");
                    }}
                  >
                    <Text style={styles.modalCancelText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalSaveBtn,
                      !locationInput.trim() && styles.modalSaveBtnDisabled,
                    ]}
                    onPress={saveLocation}
                    disabled={!locationInput.trim()}
                  >
                    <Text style={styles.modalSaveText}>Salva</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          {/* ── Search ──────────────────────────────── */}
          <View style={styles.searchBar}>
            <LinearGradient
              colors={["#E8601A", "#F5A020"]}
              style={styles.searchIconWrap}
            >
              <Ionicons name="search" size={16} color="#fff" />
            </LinearGradient>
            <TextInput
              style={[styles.searchInput, { outline: "none" } as any]}
              placeholder="Cerca..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* ── I Tuoi Tornei ───────────────────────── */}
          {MY_PARTICIPANT_TOURNAMENTS.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                I Tuoi Tornei
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
