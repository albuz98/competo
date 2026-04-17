import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../context/AuthContext";
import { useTeams } from "../../../context/TeamsContext";
import { RootStackParamList } from "../../../types/navigation";
import { colorGradient, colors } from "../../../theme/colors";
import { styles as tabStyles } from "../../../navigation/MainTabNavigator/MainTabNavigator.styles";
import {
  ButtonGeneric,
  ButtonLink,
} from "../../../components/core/Button/Button";
import { PlayerProfile } from "../../../types/user";
import { LinearGradient } from "expo-linear-gradient";
import { InputBoxRow } from "../../../components/core/InputBoxRow/InputBoxRow";
import { HeaderCardProfile } from "../../../components/HeaderCardProfile/HeaderCard";
import { pStyles } from "./ProfilePlayer.styled";
import { RESULT_CONFIG, TournamentResult } from "../../../constants/tournament";
import { styles } from "../Profile.styles";

interface ProfilePlayerProps {
  currentProfile: PlayerProfile | null;
  saving: boolean;
  edit: boolean;
}

export default function ProfilePlayer({
  currentProfile,
  saving,
  edit,
}: ProfilePlayerProps) {
  const { user, updateProfile } = useAuth();
  const { refreshTeams } = useTeams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { teams } = useTeams();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).setOptions({
      tabBarStyle: edit
        ? { display: "none" }
        : [tabStyles.tabBar, { bottom: insets.bottom + 8 }],
    });
  }, [edit]);

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

  useEffect(() => {
    if (edit) {
      setForm({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        username: user?.username ?? "",
        location: user?.location ?? "",
        dateOfBirth: user?.dateOfBirth ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [edit]);

  if (!user) {
    return (
      <View style={styles.root}>
        <Text style={styles.header}>Errore nella generazione del profilo</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 90 },
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(e) => {
          savedScrollY.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <HeaderCardProfile
          user={user}
          subtitle={user.location}
          dateOfBirth={user.dateOfBirth}
          saving={saving}
          edit={edit}
          updateProfile={updateProfile}
        >
          <View style={styles.cardEditFields}>
            <InputBoxRow
              label="Nome"
              value={form.firstName}
              onChangeText={(v) => setForm((f) => ({ ...f, firstName: v }))}
            />
            <InputBoxRow
              label="Cognome"
              value={form.lastName}
              onChangeText={(v) => setForm((f) => ({ ...f, lastName: v }))}
            />
            <InputBoxRow
              label="Username"
              value={form.username}
              onChangeText={(v) => setForm((f) => ({ ...f, username: v }))}
            />
            <InputBoxRow
              label="Data di nascita"
              value={form.dateOfBirth}
              keyboardType="number-pad"
              onChangeText={(v) => setForm((f) => ({ ...f, dateOfBirth: v }))}
            />
            <InputBoxRow
              label="Posizione"
              value={form.location}
              onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
            />
            <InputBoxRow
              label="Password"
              placeholder="Lascia vuoto per non modificare"
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              secureTextEntry
              isLast={form.password.length === 0}
              error={
                form.password.length > 0 && form.password.length < 6
                  ? "La password è troppo corta"
                  : undefined
              }
            />
            {form.password.length > 0 && (
              <InputBoxRow
                label="Conferma password"
                value={form.confirmPassword}
                onChangeText={(v) =>
                  setForm((f) => ({ ...f, confirmPassword: v }))
                }
                secureTextEntry
                isLast
                error={
                  form.confirmPassword.length > 0 &&
                  form.password !== form.confirmPassword
                    ? "Le password non coincidono"
                    : undefined
                }
              />
            )}
          </View>
        </HeaderCardProfile>

        {/* ── Statistiche Partite ────────────────── */}
        {user.matchStats && !edit && (
          <>
            <View style={styles.teamsHeader}>
              <Text style={styles.teamsTitle}>Statistiche Partite</Text>
            </View>
            <View style={pStyles.statsCard}>
              <View style={pStyles.statsCardInner}>
                <View style={pStyles.statsRow}>
                  <View style={pStyles.statBubble}>
                    <Text style={[pStyles.statNum, { color: colors.success }]}>
                      {user.matchStats.wins}
                    </Text>
                    <Text style={pStyles.statLabel}>Vittorie</Text>
                  </View>
                  <View style={pStyles.statDivider} />
                  <View style={pStyles.statBubble}>
                    <Text
                      style={[pStyles.statNum, { color: colors.placeholder }]}
                    >
                      {user.matchStats.draws}
                    </Text>
                    <Text style={pStyles.statLabel}>Pareggi</Text>
                  </View>
                  <View style={pStyles.statDivider} />
                  <View style={pStyles.statBubble}>
                    <Text style={[pStyles.statNum, { color: colors.danger }]}>
                      {user.matchStats.losses}
                    </Text>
                    <Text style={pStyles.statLabel}>Sconfitte</Text>
                  </View>
                </View>
                <View style={pStyles.statsTourneyRow}>
                  <View style={pStyles.statTourney}>
                    <Ionicons
                      name="trophy-outline"
                      size={18}
                      color={colors.primaryGradientMid}
                    />
                    <Text style={pStyles.statTourneyNum}>
                      {user.matchStats.tournamentsWon}
                    </Text>
                    <Text style={pStyles.statTourneyLabel}>Tornei vinti</Text>
                  </View>
                  <View style={pStyles.statTourneyDivider} />
                  <View style={pStyles.statTourney}>
                    <Ionicons
                      name="medal-outline"
                      size={18}
                      color={colors.placeholder}
                    />
                    <Text style={pStyles.statTourneyNum}>
                      {user.matchStats.tournamentsPlayed}
                    </Text>
                    <Text style={pStyles.statTourneyLabel}>Tornei giocati</Text>
                  </View>
                  <View style={pStyles.statTourneyDivider} />
                  <View style={pStyles.statTourney}>
                    <Ionicons
                      name="football-outline"
                      size={18}
                      color={colors.placeholder}
                    />
                    <Text style={pStyles.statTourneyNum}>
                      {user.matchStats.matchesPlayed}
                    </Text>
                    <Text style={pStyles.statTourneyLabel}>Partite totali</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── Statistiche individuali ───────────────── */}
        {!edit && currentProfile?.careerStats && (
          <>
            <View style={styles.teamsHeader}>
              <Text style={styles.teamsTitle}>
                {currentProfile.careerStats.playerRole === "portiere"
                  ? "Statistiche portiere"
                  : "Statistiche individuali"}
              </Text>
            </View>
            <View style={pStyles.careerCard}>
              <View style={pStyles.careerCardInner}>
                <View style={pStyles.careerBubble}>
                  <Text style={[pStyles.careerNum, { color: colors.primary }]}>
                    {currentProfile.careerStats.playerRole === "portiere"
                      ? (currentProfile.careerStats.goalsConceded ?? 0)
                      : (currentProfile.careerStats.goals ?? 0)}
                  </Text>
                  <Text style={pStyles.careerLabel}>
                    {currentProfile.careerStats.playerRole === "portiere"
                      ? "Gol subiti"
                      : "Gol"}
                  </Text>
                </View>
                <View style={pStyles.careerDivider} />
                <View style={pStyles.careerBubble}>
                  <Text
                    style={[
                      pStyles.careerNum,
                      { color: colors.primaryGradientEnd },
                    ]}
                  >
                    {currentProfile.careerStats.yellowCards}
                  </Text>
                  <Text style={pStyles.careerLabel}>Gialli</Text>
                </View>
                <View style={pStyles.careerDivider} />
                <View style={pStyles.careerBubble}>
                  <Text style={[pStyles.careerNum, { color: colors.danger }]}>
                    {currentProfile.careerStats.redCards}
                  </Text>
                  <Text style={pStyles.careerLabel}>Rossi</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* ── Storico tornei ────────────────────────── */}
        {!edit &&
          user.playedTournaments &&
          user.playedTournaments.length > 0 && (
            <>
              <View style={styles.teamsHeader}>
                <Text style={styles.teamsTitle}>Storico tornei</Text>
                {user.playedTournaments.length > 3 && (
                  <ButtonLink
                    text="Vedi tutti"
                    handleBtn={() => navigation.navigate("TournamentHistory")}
                    color={colors.primaryGradientMid}
                    isColored
                    isBold
                  />
                )}
              </View>
              {[...user.playedTournaments]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 3)
                .map((t) => {
                  const cfg = RESULT_CONFIG[t.result];
                  return (
                    <View key={t.id} style={pStyles.historyCard}>
                      <View style={pStyles.historyIconBox}>
                        <Text style={pStyles.historyIconText}>
                          {t.result === TournamentResult.WON
                            ? "🥇"
                            : t.result === TournamentResult.SECOND
                              ? "🥈"
                              : t.result === TournamentResult.THIRD
                                ? "🥉"
                                : "💔"}
                        </Text>
                      </View>
                      <View style={pStyles.historyInfo}>
                        <Text style={pStyles.historyName} numberOfLines={1}>
                          {t.name}
                        </Text>
                        <Text style={pStyles.historyMeta}>
                          {new Date(t.date).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · {t.location}
                        </Text>
                        <Text style={pStyles.historyTeam}>{t.teamName}</Text>
                      </View>
                      <View
                        style={[
                          pStyles.historyBadge,
                          {
                            backgroundColor:
                              t.result === TournamentResult.ELIMINATED
                                ? colors.white
                                : cfg?.color,
                          },
                        ]}
                      >
                        <Text style={pStyles.historyBadgeText}>
                          {cfg?.label}
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </>
          )}

        {/* ── Le mie squadre ─────────────────────── */}
        {!edit && (
          <>
            <View style={styles.teamsHeader}>
              <Text style={styles.teamsTitle}>Le mie squadre</Text>
              <ButtonLink
                text="Vedi tutte"
                handleBtn={() => navigation.navigate("Teams")}
                color={colors.primaryGradientMid}
                isColored
                isBold
              />
            </View>

            {teams.length === 0 ? (
              <ButtonGeneric
                style={styles.createTeamCard}
                handleBtn={() => navigation.navigate("CreateTeam")}
              >
                <LinearGradient
                  colors={colorGradient}
                  style={styles.createTeamIcon}
                >
                  <Ionicons name="add" size={22} color={colors.white} />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.createTeamTitle}>Crea una squadra</Text>
                  <Text style={styles.createTeamSub}>
                    Invita amici e partecipa ai tornei insieme
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.grayDark}
                />
              </ButtonGeneric>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.teamsScroll}
              >
                {teams.slice(0, 5).map((team) => (
                  <ButtonGeneric
                    key={team.id}
                    style={styles.teamMiniCard}
                    handleBtn={() =>
                      navigation.navigate("TeamDetail", { teamId: team.id })
                    }
                  >
                    <LinearGradient
                      colors={colorGradient}
                      style={styles.teamMiniAvatar}
                    >
                      <Text style={styles.teamMiniAvatarText}>
                        {team.name.slice(0, 2).toUpperCase()}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.teamMiniName} numberOfLines={2}>
                      {team.name}
                    </Text>
                    <Text style={styles.teamMiniSport}>{team.sport}</Text>
                  </ButtonGeneric>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
