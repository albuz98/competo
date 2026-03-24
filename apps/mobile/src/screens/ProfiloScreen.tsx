import React, { useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useTeams } from "../context/TeamsContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, Team, OrganizedTournamentRecord } from "../types";

export default function ProfiloScreen() {
  const { user, location, logout, updateProfile } = useAuth();
  const { teams, refreshTeams } = useTeams();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const savedScrollY = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const y = savedScrollY.current;
      if (y > 0) {
        setTimeout(() => scrollRef.current?.scrollTo({ y, animated: false }), 50);
      }
      if (user) refreshTeams();
    }, [user?.id])
  );

  const initial = user?.firstName?.[0]?.toUpperCase() ?? user?.username?.[0]?.toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permesso negato",
        "Abilita l'accesso alla galleria nelle impostazioni."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfile({ avatarUri: result.assets[0].uri });
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <Text style={styles.header}>Profilo</Text>
        <View style={styles.guestBox}>
          <Ionicons name="person-circle-outline" size={72} color="#e2e8f0" />
          <Text style={styles.guestTitle}>Non sei connesso</Text>
          <Text style={styles.guestSub}>Accedi per vedere il tuo profilo</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("Login", {})}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Accedi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 12 }}
          >
            <Text style={styles.registerLink}>Crea un account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <Text style={styles.header}>Profilo</Text>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        scrollEventThrottle={16}
        onScroll={(e) => { savedScrollY.current = e.nativeEvent.contentOffset.y; }}
      >

      <View style={styles.card}>
        {/* Avatar + pencil */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.85}>
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatarImg} />
            ) : (
              <LinearGradient
                colors={["#E8601A", "#F5A020"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initial}</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pencilBtn}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
          >
            <Ionicons name="pencil" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.username}>{fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Row icon="person-outline" label="Nome" value={user.firstName ?? "–"} />
        <Row icon="people-outline" label="Cognome" value={user.lastName ?? "–"} />
        <Row icon="at-outline" label="Username" value={user.username} />
        <Row icon="mail-outline" label="Email" value={user.email} />
        <Row icon="lock-closed-outline" label="Password" value="••••••••" />
        <Row icon="calendar-outline" label="Data di nascita" value={user.dateOfBirth ?? "–"} />
        <Row icon="location-outline" label="Posizione" value={user.location ?? location ?? "–"} isLast />
      </View>

      {/* ── Statistiche Partite ────────────────── */}
      {user.matchStats && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Statistiche Partite</Text>
          </View>
          <View style={pStyles.statsCard}>
            <View style={pStyles.statsRow}>
              <View style={pStyles.statBubble}>
                <Text style={[pStyles.statNum, { color: "#10b981" }]}>{user.matchStats.wins}</Text>
                <Text style={pStyles.statLabel}>Vittorie</Text>
              </View>
              <View style={pStyles.statDivider} />
              <View style={pStyles.statBubble}>
                <Text style={[pStyles.statNum, { color: "#64748b" }]}>{user.matchStats.draws}</Text>
                <Text style={pStyles.statLabel}>Pareggi</Text>
              </View>
              <View style={pStyles.statDivider} />
              <View style={pStyles.statBubble}>
                <Text style={[pStyles.statNum, { color: "#ef4444" }]}>{user.matchStats.losses}</Text>
                <Text style={pStyles.statLabel}>Sconfitte</Text>
              </View>
            </View>
            <View style={pStyles.statsTourneyRow}>
              <View style={pStyles.statTourney}>
                <Ionicons name="trophy-outline" size={18} color="#E8601A" />
                <Text style={pStyles.statTourneyNum}>{user.matchStats.tournamentsWon}</Text>
                <Text style={pStyles.statTourneyLabel}>Tornei vinti</Text>
              </View>
              <View style={pStyles.statTourneyDivider} />
              <View style={pStyles.statTourney}>
                <Ionicons name="medal-outline" size={18} color="#64748b" />
                <Text style={pStyles.statTourneyNum}>{user.matchStats.tournamentsPlayed}</Text>
                <Text style={pStyles.statTourneyLabel}>Tornei giocati</Text>
              </View>
              <View style={pStyles.statTourneyDivider} />
              <View style={pStyles.statTourney}>
                <Ionicons name="football-outline" size={18} color="#64748b" />
                <Text style={pStyles.statTourneyNum}>{user.matchStats.matchesPlayed}</Text>
                <Text style={pStyles.statTourneyLabel}>Partite totali</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* ── Le mie squadre ─────────────────────── */}
      <View style={styles.teamsHeader}>
        <Text style={styles.teamsTitle}>Le mie squadre</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Teams")}
          activeOpacity={0.8}
        >
          <Text style={styles.teamsViewAll}>Vedi tutte</Text>
        </TouchableOpacity>
      </View>

      {teams.length === 0 ? (
        <TouchableOpacity
          style={styles.createTeamCard}
          onPress={() => navigation.navigate("CreateTeam")}
          activeOpacity={0.85}
        >
          <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.createTeamIcon}>
            <Ionicons name="add" size={22} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.createTeamTitle}>Crea una squadra</Text>
            <Text style={styles.createTeamSub}>Invita amici e partecipa ai tornei insieme</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.teamsScroll}
        >
          {teams.slice(0, 5).map((t) => (
            <TeamMiniCard
              key={t.id}
              team={t}
              onPress={() => navigation.navigate("TeamDetail", { teamId: t.id })}
            />
          ))}
          <TouchableOpacity
            style={styles.addTeamBtn}
            onPress={() => navigation.navigate("CreateTeam")}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.addTeamBtnGrad}>
              <Ionicons name="add" size={20} color="#fff" />
            </LinearGradient>
            <Text style={styles.addTeamBtnText}>Nuova</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ── Tornei Organizzati ─────────────────── */}
      {user.isOrganizer && user.organizedTournaments && user.organizedTournaments.length > 0 && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Tornei Organizzati</Text>
          </View>
          {user.organizedTournaments.map((t) => (
            <OrgTournamentCard
              key={t.id}
              record={t}
              onPress={() => navigation.navigate('OrganizerTournamentDetail', { tournamentId: t.id })}
            />
          ))}
        </>
      )}

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate("EditProfile")}
        activeOpacity={0.85}
      >
        <Ionicons name="create-outline" size={20} color="#E8601A" />
        <Text style={styles.editBtnText}>Modifica profilo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function TeamMiniCard({ team, onPress }: { team: Team; onPress: () => void }) {
  const initials = team.name.slice(0, 2).toUpperCase();
  return (
    <TouchableOpacity style={styles.teamMiniCard} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.teamMiniAvatar}>
        <Text style={styles.teamMiniAvatarText}>{initials}</Text>
      </LinearGradient>
      <Text style={styles.teamMiniName} numberOfLines={2}>{team.name}</Text>
      <Text style={styles.teamMiniSport}>{team.sport}</Text>
    </TouchableOpacity>
  );
}

function Row({
  icon,
  label,
  value,
  isLast,
}: {
  icon: any;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <Ionicons name={icon} size={20} color="#94a3b8" style={{ width: 28 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

function OrgTournamentCard({ record, onPress }: { record: OrganizedTournamentRecord; onPress: () => void }) {
  const dateStr = new Date(record.date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <TouchableOpacity style={pStyles.orgCard} onPress={onPress} activeOpacity={0.85}>
      <View style={pStyles.orgCardLeft} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={pStyles.orgCardName} numberOfLines={1}>{record.name}</Text>
          <View style={pStyles.orgSportBadge}>
            <Text style={pStyles.orgSportText}>{record.sport}</Text>
          </View>
        </View>
        <View style={pStyles.orgCardRow}>
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <Text style={pStyles.orgCardMeta}> {record.location}</Text>
          <Text style={pStyles.orgCardMetaDot}> · </Text>
          <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
          <Text style={pStyles.orgCardMeta}> {dateStr}</Text>
        </View>
        <View style={pStyles.orgCardStatsRow}>
          <Ionicons name="people-outline" size={13} color="#64748b" />
          <Text style={pStyles.orgCardStat}> {record.totalTeams} squadre</Text>
          <Text style={pStyles.orgCardMetaDot}> · </Text>
          <Ionicons name="cash-outline" size={13} color="#64748b" />
          <Text style={pStyles.orgCardStat}> {record.totalPrizeMoney}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { paddingBottom: 32 },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  pencilBtn: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E8601A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  email: { fontSize: 13, color: "#64748b", marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 8,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#1e293b", marginTop: 1 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
  },
  editBtnText: { color: "#E8601A", fontSize: 15, fontWeight: "700" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#fecaca",
  },
  logoutText: { color: "#ef4444", fontSize: 15, fontWeight: "700" },
  // Teams section
  teamsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  teamsTitle: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  teamsViewAll: { fontSize: 13, color: "#E8601A", fontWeight: "700" },

  teamsScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },

  teamMiniCard: {
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  teamMiniAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  teamMiniAvatarText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  teamMiniName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    lineHeight: 14,
  },
  teamMiniSport: { fontSize: 10, color: "#94a3b8", marginTop: 2 },

  addTeamBtn: { width: 100, alignItems: "center", justifyContent: "center" },
  addTeamBtnGrad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  addTeamBtnText: { fontSize: 11, fontWeight: "700", color: "#E8601A" },

  createTeamCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1.5,
    borderColor: "#fed7aa",
  },
  createTeamIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  createTeamTitle: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  createTeamSub: { fontSize: 11, color: "#94a3b8", marginTop: 2 },

  // Guest state
  guestBox: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  guestTitle: { fontSize: 18, fontWeight: "700", color: "#94a3b8", marginTop: 16 },
  guestSub: { fontSize: 13, color: "#cbd5e1", marginTop: 6, textAlign: "center" },
  loginBtn: {
    marginTop: 24,
    backgroundColor: "#E8601A",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  loginBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  registerLink: { color: "#E8601A", fontWeight: "600", fontSize: 14 },
});

const pStyles = StyleSheet.create({
  // Match stats card
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  statBubble: {
    flex: 1,
    alignItems: "center",
  },
  statNum: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f1f5f9",
    alignSelf: "stretch",
  },
  statsTourneyRow: {
    flexDirection: "row",
    paddingVertical: 14,
  },
  statTourney: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statTourneyNum: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },
  statTourneyLabel: {
    fontSize: 10,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statTourneyDivider: {
    width: 1,
    backgroundColor: "#f1f5f9",
    alignSelf: "stretch",
  },
  // Organized tournament cards
  orgCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    padding: 14,
    gap: 12,
  },
  orgCardLeft: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "#E8601A",
    alignSelf: "stretch",
  },
  orgCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  orgSportBadge: {
    backgroundColor: "#fff7ed",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  orgSportText: {
    fontSize: 11,
    color: "#E8601A",
    fontWeight: "700",
  },
  orgCardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  orgCardMeta: {
    fontSize: 11,
    color: "#94a3b8",
  },
  orgCardMetaDot: {
    fontSize: 11,
    color: "#cbd5e1",
  },
  orgCardStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  orgCardStat: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
});
