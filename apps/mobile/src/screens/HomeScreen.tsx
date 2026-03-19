import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
import type { RootStackParamList, Tournament, MainTabParamList } from "../types";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { generateTournaments } from "../mock/data";
import { getMyTournamentsCache } from "../api/tournaments";
import type { MyTournament } from "../types";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

const { width: SW } = Dimensions.get("window");
const BIG_W = SW * 0.72;
const BIG_H = 200;
const SMALL_W = SW * 0.42;

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
const MY_TOURNAMENTS: MyTournament[] = getMyTournamentsCache();
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
          <Ionicons name="shield-checkmark" size={10} color="#94a3b8" />
          <Text style={styles.smallCardMeta}> {tournament.game}</Text>
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
export default function HomeScreen() {
  const { user, location, updateLocation } = useAuth();
  const { unreadCount } = useNotifications();
  const navigation = useNavigation<HomeNavProp>();
  const [search, setSearch] = useState("");
  const [locationModal, setLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState("");

  const initial = user?.firstName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? "U";
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : (user?.username ?? "Utente");

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
      navigation.navigate("Login", { redirect: "tournament", tournamentId: id });
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
              <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.avatar}>
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
                <Text style={[styles.locationText, !location && styles.locationPlaceholder]}>
                  {location ?? "Inserisci posizione"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Notifiche")}>
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
                <Text style={styles.modalSub}>Inserisci la tua città per trovare tornei vicino a te</Text>
                <View style={styles.modalInputRow}>
                  <Ionicons name="location-outline" size={18} color="#E8601A" style={{ marginRight: 8 }} />
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
                    onPress={() => { setLocationModal(false); setLocationInput(""); }}
                  >
                    <Text style={styles.modalCancelText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalSaveBtn, !locationInput.trim() && styles.modalSaveBtnDisabled]}
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
          <Text style={styles.sectionTitle}>I Tuoi Tornei</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            {MY_TOURNAMENTS.map((t, i) => (
              <BigCard
                key={t.id}
                tournament={t}
                index={i}
                onPress={() => goToMyTournament(t.id)}
              />
            ))}
          </ScrollView>

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  safeArea: { flex: 1 },
  scroll: { paddingBottom: 100 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  greetingBlock: { flex: 1 },
  greetingText: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  locationText: { fontSize: 12, color: "#64748b", fontWeight: "500" },
  locationPlaceholder: { color: "#E8601A", fontWeight: "600" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 6 },
  modalSub: { fontSize: 13, color: "#64748b", marginBottom: 20 },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  modalInput: { flex: 1, fontSize: 15, color: "#1e293b" },
  modalBtns: { flexDirection: "row", gap: 12 },
  modalCancelBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  modalCancelText: { color: "#64748b", fontWeight: "700", fontSize: 15 },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#E8601A",
  },
  modalSaveBtnDisabled: { opacity: 0.45 },
  modalSaveText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1e293b" },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hList: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },

  // Big card
  bigCard: { borderRadius: 18, overflow: "hidden" },
  bigCardGradient: { flex: 1, justifyContent: "flex-end" },
  bigCardDecor: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  bigCardEmoji: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    fontSize: 56,
    marginTop: -40,
  },
  bigCardOverlay: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 12,
    margin: 10,
    padding: 10,
  },
  bigCardName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 0.2,
  },
  bigCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  bigCardLocationText: { fontSize: 11, color: "#64748b" },

  // Small card
  smallCard: {
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 15,
  },
  smallCardTop: {
    height: SMALL_W * 0.85,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  smallCardEmoji: { fontSize: 44 },
  smallCardBody: { padding: 10 },
  smallCardName: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  smallCardRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  smallCardMeta: { fontSize: 10, color: "#94a3b8", flex: 1 },
  vediAltroBtn: {
    backgroundColor: "#E8601A",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  vediAltroText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
