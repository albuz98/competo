import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import {
  RootStackParamList,
  MainTabParamList,
  TournamentResult,
  UserProfile,
  UserRole,
  type MyTournament,
  type OrganizerProfile as OrganizerProfileType,
  type PlayerProfile as PlayerProfileType,
} from "../../types";
import { pStyles, styles } from "./Profile.styles";
import { colorGradient, colors } from "../../theme/colors";
import { Avatar } from "../../components/Avatar/Avatar";
import { styles as tabStyles } from "../../navigation/MainTabNavigator/MainTabNavigator.styles";
import {
  ButtonGeneric,
  ButtonIcon,
  ButtonLink,
} from "../../components/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { ModalViewer } from "../../components/Modal/Modal";
import { fetchMyTournaments } from "../../api/tournaments";
import { OrganizerProfile } from "./subComponents/OrganizeProfile/OrganizerProfile";
import { HeaderCard } from "./subComponents/HeaderCard/HeaderCard";
import InputBox from "../../components/InputBox/InputBox";
import { getProfileSubtitle } from "../../functions/profile";
import { RESULT_CONFIG } from "../../constants/tournament";

export default function Profile() {
  const {
    user,
    currentProfile,
    updateProfile,
    switchProfile,
    updateOrgProfileData,
  } = useAuth();
  const { teams, refreshTeams } = useTeams();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    orgName: "",
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, "Profilo">>();
  const insets = useSafeAreaInsets();
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [orgTournaments, setOrgTournaments] = useState<MyTournament[]>([]);
  const [loadingOrgTournaments, setLoadingOrgTournaments] = useState(false);

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

  const isOrganizerProfile = currentProfile?.role === UserRole.ORGANIZER;
  const playerProfile = !isOrganizerProfile
    ? (currentProfile as PlayerProfileType | null)
    : null;

  useEffect(() => {
    if (isOrganizerProfile) {
      loadOrganizerTournaments();
    }
  }, [currentProfile?.id]);

  const loadOrganizerTournaments = async () => {
    setLoadingOrgTournaments(true);
    try {
      const allTournaments = await fetchMyTournaments();
      const organizerTournaments = allTournaments.filter((t) => t.isOrganizer);
      setOrgTournaments(organizerTournaments);
    } catch (error) {
      console.error("Error loading organizer tournaments:", error);
    } finally {
      setLoadingOrgTournaments(false);
    }
  };

  const handleSwitchProfile = (profile: UserProfile) => {
    switchProfile(profile.id);
    setChangeProfileModal(false);
  };

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
      if (route.params?.startEdit) {
        handleStartEdit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigation as any).setParams({ startEdit: undefined });
      }
    }, [user?.id, route.params?.startEdit]),
  );

  const handleStartEdit = () => {
    const orgProfile =
      currentProfile?.role === UserRole.ORGANIZER
        ? (currentProfile as OrganizerProfileType)
        : null;
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      location: user?.location ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      password: "",
      confirmPassword: "",
      orgName: orgProfile?.orgName ?? "",
    });
    setEdit(true);
  };

  const handleSave = async () => {
    const passwordChanged = form.password.length > 0;
    if (passwordChanged && form.password.length < 6) {
      Alert.alert(
        "Password troppo corta",
        "La password deve essere almeno 6 caratteri.",
      );
      return;
    }
    if (passwordChanged && form.password !== form.confirmPassword) {
      Alert.alert(
        "Password non coincidono",
        "Le password inserite non corrispondono.",
      );
      return;
    }

    // Salva campi organizzatore
    if (
      currentProfile?.role === UserRole.ORGANIZER &&
      form.orgName !== (currentProfile as OrganizerProfileType).orgName
    ) {
      updateOrgProfileData(currentProfile.id, { orgName: form.orgName });
    }

    const hasChanges =
      form.firstName !== (user?.firstName ?? "") ||
      form.lastName !== (user?.lastName ?? "") ||
      form.username !== (user?.username ?? "") ||
      form.location !== (user?.location ?? "") ||
      form.dateOfBirth !== (user?.dateOfBirth ?? "") ||
      (passwordChanged && form.password.length >= 6);

    if (hasChanges) {
      if (form.location && form.location !== (user?.location ?? "")) {
        const results = await Location.geocodeAsync(form.location);
        if (results.length === 0) {
          Alert.alert(
            "Posizione non valida",
            "Inserisci una città o un indirizzo esistente.",
          );
          return;
        }
      }
      setSaving(true);
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        location: form.location,
        ...(form.password ? { password: form.password } : {}),
      });
      setSaving(false);
    }
    setEdit(false);
    navigation.navigate("Settings");
  };

  const handleOpenSettings = () => {
    navigation.navigate("Settings");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <Text style={styles.header}>Errore nella generazione del profilo</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.root} edges={["top"]}>
        <Pressable onPress={() => !edit && setChangeProfileModal(true)}>
          <View style={styles.header}>
            {!edit ? (
              <View style={styles.containerHeaderText}>
                <Text style={styles.headerText}>
                  {currentProfile?.role === UserRole.ORGANIZER
                    ? (currentProfile as OrganizerProfileType).orgName
                    : currentProfile?.username || user.username}
                </Text>
                <Entypo name="chevron-down" size={20} color="black" />
              </View>
            ) : (
              <Text style={styles.headerText}>Modifica profilo</Text>
            )}
            {edit ? (
              <ButtonLink
                text="FATTO"
                handleBtn={handleSave}
                color={colors.primary}
                fontSize={16}
                isBold
                isColored
              />
            ) : (
              <ButtonIcon
                handleBtn={handleOpenSettings}
                icon={
                  <Ionicons
                    name="settings-outline"
                    size={22}
                    color={colors.primary}
                  />
                }
              />
            )}
          </View>
        </Pressable>
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
          {/* ── ORGANIZER PROFILE ─────────────────────────── */}
          {isOrganizerProfile ? (
            <OrganizerProfile
              selectedProfile={currentProfile as OrganizerProfileType | null}
              orgTournaments={orgTournaments}
              loadingOrgTournaments={loadingOrgTournaments}
              user={user}
              saving={saving}
              edit={edit}
              orgName={form.orgName}
              onOrgNameChange={(v) => setForm((f) => ({ ...f, orgName: v }))}
              updateProfile={updateProfile}
              updateOrgProfileData={updateOrgProfileData}
              handleStartEdit={handleStartEdit}
            />
          ) : (
            <>
              {/* ── PLAYER PROFILE (existing code) ─────────────────── */}
              <HeaderCard
                user={user}
                subtitle={user.location}
                dateOfBirth={user.dateOfBirth}
                saving={saving}
                edit={edit}
                updateProfile={updateProfile}
              >
                <View style={styles.cardEditFields}>
                  <InputBox
                    variant="row"
                    label="Nome"
                    value={form.firstName}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, firstName: v }))
                    }
                  />
                  <InputBox
                    variant="row"
                    label="Cognome"
                    value={form.lastName}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, lastName: v }))
                    }
                  />
                  <InputBox
                    variant="row"
                    label="Username"
                    value={form.username}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, username: v }))
                    }
                  />
                  <InputBox
                    variant="row"
                    label="Data di nascita"
                    value={form.dateOfBirth}
                    keyboardType="number-pad"
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, dateOfBirth: v }))
                    }
                  />
                  <InputBox
                    variant="row"
                    label="Posizione"
                    value={form.location}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, location: v }))
                    }
                  />
                  <InputBox
                    variant="row"
                    label="Password"
                    placeholder="Lascia vuoto per non modificare"
                    value={form.password}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, password: v }))
                    }
                    secureTextEntry
                    isLast={form.password.length === 0}
                    error={
                      form.password.length > 0 && form.password.length < 6
                        ? "La password è troppo corta"
                        : undefined
                    }
                  />
                  {form.password.length > 0 && (
                    <InputBox
                      variant="row"
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
              </HeaderCard>
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
                          <Text
                            style={[pStyles.statNum, { color: colors.success }]}
                          >
                            {user.matchStats.wins}
                          </Text>
                          <Text style={pStyles.statLabel}>Vittorie</Text>
                        </View>
                        <View style={pStyles.statDivider} />
                        <View style={pStyles.statBubble}>
                          <Text
                            style={[
                              pStyles.statNum,
                              { color: colors.placeholder },
                            ]}
                          >
                            {user.matchStats.draws}
                          </Text>
                          <Text style={pStyles.statLabel}>Pareggi</Text>
                        </View>
                        <View style={pStyles.statDivider} />
                        <View style={pStyles.statBubble}>
                          <Text
                            style={[pStyles.statNum, { color: colors.danger }]}
                          >
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
                          <Text style={pStyles.statTourneyLabel}>
                            Tornei vinti
                          </Text>
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
                          <Text style={pStyles.statTourneyLabel}>
                            Tornei giocati
                          </Text>
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
                          <Text style={pStyles.statTourneyLabel}>
                            Partite totali
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}

              {/* ── Statistiche individuali ───────────────── */}
              {!edit && playerProfile?.careerStats && (
                <>
                  <View style={styles.teamsHeader}>
                    <Text style={styles.teamsTitle}>
                      {playerProfile.careerStats.playerRole === "portiere"
                        ? "Statistiche portiere"
                        : "Statistiche individuali"}
                    </Text>
                  </View>
                  <View style={pStyles.careerCard}>
                    <View style={pStyles.careerCardInner}>
                      {/* Gol / Gol subiti */}
                      <View style={pStyles.careerBubble}>
                        <Text
                          style={[pStyles.careerNum, { color: colors.primary }]}
                        >
                          {playerProfile.careerStats.playerRole === "portiere"
                            ? (playerProfile.careerStats.goalsConceded ?? 0)
                            : (playerProfile.careerStats.goals ?? 0)}
                        </Text>
                        <Text style={pStyles.careerLabel}>
                          {playerProfile.careerStats.playerRole === "portiere"
                            ? "Gol subiti"
                            : "Gol"}
                        </Text>
                      </View>
                      <View style={pStyles.careerDivider} />
                      {/* Cartellini gialli */}
                      <View style={pStyles.careerBubble}>
                        <Text
                          style={[
                            pStyles.careerNum,
                            { color: colors.primaryGradientEnd },
                          ]}
                        >
                          {playerProfile.careerStats.yellowCards}
                        </Text>
                        <Text style={pStyles.careerLabel}>Gialli</Text>
                      </View>
                      <View style={pStyles.careerDivider} />
                      {/* Cartellini rossi */}
                      <View style={pStyles.careerBubble}>
                        <Text
                          style={[pStyles.careerNum, { color: colors.danger }]}
                        >
                          {playerProfile.careerStats.redCards}
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
                          handleBtn={() =>
                            navigation.navigate("TournamentHistory")
                          }
                          color={colors.primaryGradientMid}
                          isColored
                          isBold
                        />
                      )}
                    </View>
                    {[...user.playedTournaments]
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
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
                              <Text
                                style={pStyles.historyName}
                                numberOfLines={1}
                              >
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
                              <Text style={pStyles.historyTeam}>
                                {t.teamName}
                              </Text>
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
                        <Text style={styles.createTeamTitle}>
                          Crea una squadra
                        </Text>
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
                            navigation.navigate("TeamDetail", {
                              teamId: team.id,
                            })
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
            </>
          )}
        </ScrollView>
        <ModalViewer
          isOpen={changeProfileModal}
          onClose={() => setChangeProfileModal(false)}
        >
          <View style={styles.headerModal}>
            <Text style={styles.headerModalText}>I tuoi profili</Text>
            <Ionicons name="add" size={24} color={colors.primaryGradientMid} />
          </View>
          {user?.profiles && user.profiles.length > 0 ? (
            <View style={{ gap: 10 }}>
              {user.profiles.map((profile) => (
                <Pressable
                  key={profile.id}
                  onPress={() => handleSwitchProfile(profile)}
                  style={[
                    styles.containerProfileModal,
                    {
                      borderColor:
                        currentProfile?.id === profile.id
                          ? colors.primary
                          : colors.gray,
                    },
                  ]}
                >
                  <Avatar
                    user={
                      profile.role === UserRole.PLAYER
                        ? {
                            ...profile,
                            avatarUrl: profile.avatarUrl ?? user.avatarUrl,
                          }
                        : profile
                    }
                    dimension={sizesEnum.small}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: colors.dark,
                      }}
                    >
                      {profile.role === UserRole.ORGANIZER
                        ? (profile as OrganizerProfileType).orgName
                        : profile.username}
                    </Text>
                    {getProfileSubtitle(profile, user) && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.placeholder,
                          marginTop: 2,
                        }}
                      >
                        {getProfileSubtitle(profile, user)}
                      </Text>
                    )}
                  </View>
                  {currentProfile?.id === profile.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          ) : (
            <Text
              style={{
                fontSize: 14,
                color: colors.placeholder,
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              Nessun profilo disponibile
            </Text>
          )}
        </ModalViewer>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
