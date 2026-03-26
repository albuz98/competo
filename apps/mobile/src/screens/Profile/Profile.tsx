import React, { useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import {
  RootStackParamList,
  Team,
} from "../../types";
import { pStyles, styles } from "./Profile.styles";

export default function Profile() {
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
        setTimeout(
          () => scrollRef.current?.scrollTo({ y, animated: false }),
          50,
        );
      }
      if (user) refreshTeams();
    }, [user?.id]),
  );

  const initial =
    user?.firstName?.[0]?.toUpperCase() ??
    user?.username?.[0]?.toUpperCase() ??
    "U";

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "ChoseAccess" }] });
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permesso negato",
        "Abilita l'accesso alla galleria nelle impostazioni.",
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
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 90 },
        ]}
        scrollEventThrottle={16}
        onScroll={(e) => {
          savedScrollY.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <View style={styles.card}>
          {/* Avatar + pencil */}
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.85}>
              {user.avatarUri ? (
                <Image
                  source={{ uri: user.avatarUri }}
                  style={styles.avatarImg}
                />
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
          <Row
            icon="person-outline"
            label="Nome"
            value={user.firstName ?? "–"}
          />
          <Row
            icon="people-outline"
            label="Cognome"
            value={user.lastName ?? "–"}
          />
          <Row icon="at-outline" label="Username" value={user.username} />
          <Row icon="mail-outline" label="Email" value={user.email} />
          <Row icon="lock-closed-outline" label="Password" value="••••••••" />
          <Row
            icon="calendar-outline"
            label="Data di nascita"
            value={user.dateOfBirth ?? "–"}
          />
          <Row
            icon="location-outline"
            label="Posizione"
            value={user.location ?? location ?? "–"}
            isLast
          />
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
                  <Text style={[pStyles.statNum, { color: "#10b981" }]}>
                    {user.matchStats.wins}
                  </Text>
                  <Text style={pStyles.statLabel}>Vittorie</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: "#64748b" }]}>
                    {user.matchStats.draws}
                  </Text>
                  <Text style={pStyles.statLabel}>Pareggi</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: "#ef4444" }]}>
                    {user.matchStats.losses}
                  </Text>
                  <Text style={pStyles.statLabel}>Sconfitte</Text>
                </View>
              </View>
              <View style={pStyles.statsTourneyRow}>
                <View style={pStyles.statTourney}>
                  <Ionicons name="trophy-outline" size={18} color="#E8601A" />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.tournamentsWon}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Tornei vinti</Text>
                </View>
                <View style={pStyles.statTourneyDivider} />
                <View style={pStyles.statTourney}>
                  <Ionicons name="medal-outline" size={18} color="#64748b" />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.tournamentsPlayed}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Tornei giocati</Text>
                </View>
                <View style={pStyles.statTourneyDivider} />
                <View style={pStyles.statTourney}>
                  <Ionicons name="football-outline" size={18} color="#64748b" />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.matchesPlayed}
                  </Text>
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
            <LinearGradient
              colors={["#E8601A", "#F5A020"]}
              style={styles.createTeamIcon}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.createTeamTitle}>Crea una squadra</Text>
              <Text style={styles.createTeamSub}>
                Invita amici e partecipa ai tornei insieme
              </Text>
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
                onPress={() =>
                  navigation.navigate("TeamDetail", { teamId: t.id })
                }
              />
            ))}
            <TouchableOpacity
              style={styles.addTeamBtn}
              onPress={() => navigation.navigate("CreateTeam")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#E8601A", "#F5A020"]}
                style={styles.addTeamBtnGrad}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.addTeamBtnText}>Nuova</Text>
            </TouchableOpacity>
          </ScrollView>
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
    <TouchableOpacity
      style={styles.teamMiniCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#E8601A", "#F5A020"]}
        style={styles.teamMiniAvatar}
      >
        <Text style={styles.teamMiniAvatarText}>{initials}</Text>
      </LinearGradient>
      <Text style={styles.teamMiniName} numberOfLines={2}>
        {team.name}
      </Text>
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

