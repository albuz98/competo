import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import { RootStackParamList, UserProfile } from "../../types";
import { pStyles, styles } from "./Profile.styles";
import { colorGradient, colors } from "../../theme/colors";
import { Avatar } from "../../components/Avatar/Avatar";
import InputBox from "../../components/InputBox/InputBox";
import { styles as tabStyles } from "../../navigation/MainTabNavigator/MainTabNavigator.styles";
import {
  ButtonBorderColored,
  ButtonGeneric,
  ButtonGradient,
  ButtonIcon,
  ButtonLink,
} from "../../components/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { ModalViewer } from "../../components/Modal/Modal";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
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
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [changeProfileModal, setChangeProfileModal] = useState(false);

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
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    user?.profiles?.find((p) => p.id === user?.currentProfileId) ||
      user?.profiles?.[0] ||
      null,
  );

  const handleSwitchProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
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
    }, [user?.id]),
  );

  const handleStartEdit = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      location: user?.location ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      password: user?.password ?? "",
      confirmPassword: "",
    });
    setEdit(true);
  };

  const handleSave = async () => {
    const passwordChanged = form.password !== (user?.password ?? "");
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
  };

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
      await updateProfile({ avatarUrl: result.assets[0].uri });
    }
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
        <Pressable onPress={() => setChangeProfileModal(true)}>
          <View style={styles.header}>
            {!edit ? (
              <View style={styles.containerHeaderText}>
                <Text style={styles.headerText}>{user.username}</Text>
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
                handleBtn={handleLogout}
                icon={
                  <Ionicons
                    name="log-out-outline"
                    size={20}
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
          <View style={[styles.card, edit && styles.cardEdit]}>
            {/* Avatar + pencil */}
            <View style={styles.avatarWrapper}>
              <Avatar user={user} />
              {edit && (
                <ButtonIcon
                  icon={
                    <Ionicons name="pencil" size={13} color={colors.white} />
                  }
                  style={styles.pencilBtn}
                  handleBtn={handlePickAvatar}
                />
              )}
            </View>
            {!edit && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.username}>{user.username}</Text>
                  <Text style={styles.email}>{user.location}</Text>
                </View>
                <ButtonBorderColored
                  isColored
                  handleBtn={handleStartEdit}
                  size={sizesEnum.medium}
                  text="Modifica"
                  iconLeft={
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={colors.primary}
                    />
                  }
                />
              </View>
            )}
            {edit && (
              <View style={styles.cardEditFields}>
                <InputBox
                  variant="row"
                  label="Nome"
                  value={form.firstName}
                  onChangeText={(v) => setForm((f) => ({ ...f, firstName: v }))}
                />
                <InputBox
                  variant="row"
                  label="Cognome"
                  value={form.lastName}
                  onChangeText={(v) => setForm((f) => ({ ...f, lastName: v }))}
                />
                <InputBox
                  variant="row"
                  label="Username"
                  value={form.username}
                  onChangeText={(v) => setForm((f) => ({ ...f, username: v }))}
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
                  onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
                />
                <InputBox
                  variant="row"
                  label="Nuova password"
                  value={form.password}
                  onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
                  secureTextEntry
                  isLast={form.password === (user?.password ?? "")}
                  error={
                    form.password !== (user?.password ?? "") &&
                    form.password.length < 6
                      ? "La password è troppo corta"
                      : undefined
                  }
                />
                {form.password !== (user?.password ?? "") && (
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
            )}
            {saving && (
              <View style={styles.cardSavingOverlay}>
                <ActivityIndicator size="large" color={colors.white} />
              </View>
            )}
          </View>

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

          {/* ── Genera Calendario Torneo ────────────── */}
          {!edit && (
            <>
              <View style={styles.teamsHeader}>
                <Text style={styles.teamsTitle}>Organizzazione</Text>
              </View>
              <ButtonGeneric
                style={styles.createTeamCard}
                handleBtn={() =>
                  navigation.navigate("CreateTournamentSchedule")
                }
              >
                <LinearGradient
                  colors={colorGradient}
                  style={styles.createTeamIcon}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={colors.white}
                  />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.createTeamTitle}>
                    Genera Calendario Torneo
                  </Text>
                  <Text style={styles.createTeamSub}>
                    Crea tabelloni e calendari automatici per gironi,
                    eliminatorie e sistemi svizzeri
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.grayDark}
                />
              </ButtonGeneric>
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
                  color={styles.teamsViewAll.color as string}
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
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.white,
                      borderRadius: 12,
                      padding: 12,
                      borderWidth: 2,
                      borderColor:
                        selectedProfile?.id === profile.id
                          ? colors.primary
                          : colors.gray,
                    },
                  ]}
                >
                  {profile.avatarUrl ? (
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: colors.primaryGradientMid,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                        overflow: "hidden",
                      }}
                    >
                      {/* Avatar image would go here */}
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 18,
                          fontWeight: "800",
                        }}
                      >
                        {profile.username.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: colors.primaryGradientMid,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 18,
                          fontWeight: "800",
                        }}
                      >
                        {profile.username.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: colors.dark,
                      }}
                    >
                      {profile.username}
                    </Text>
                    {profile.role && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.placeholder,
                          marginTop: 2,
                        }}
                      >
                        {profile.role}
                      </Text>
                    )}
                  </View>
                  {selectedProfile?.id === profile.id && (
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
