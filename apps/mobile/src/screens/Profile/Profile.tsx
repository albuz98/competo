import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import { RootStackParamList } from "../../types";
import { pStyles, styles } from "./Profile.styles";
import { colorGradient, colors } from "../../theme/colors";
import { Avatar } from "../../components/Avatar/Avatar";
import InputBox from "../../components/InputBox/InputBox";
import { styles as tabStyles } from "../../navigation/MainTabNavigator/MainTabNavigator.styles";
import {
  ButtonBorderColored,
  ButtonIcon,
  ButtonLink,
} from "../../components/Button/Button";
import { sizesEnum } from "../../theme/dimension";

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
        <View style={styles.header}>
          <Text style={styles.headerText}>Profilo</Text>
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
                <TouchableOpacity
                  style={styles.pencilBtn}
                  onPress={handlePickAvatar}
                  activeOpacity={0.85}
                >
                  <Ionicons name="pencil" size={13} color="#fff" />
                </TouchableOpacity>
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
                <ActivityIndicator size="large" color="#fff" />
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
                      <Ionicons
                        name="trophy-outline"
                        size={18}
                        color="#E8601A"
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
                        color="#64748b"
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
                        color="#64748b"
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
                <TouchableOpacity
                  style={styles.createTeamCard}
                  onPress={() => navigation.navigate("CreateTeam")}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={colorGradient}
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
                  {teams.slice(0, 5).map((team) => (
                    <TouchableOpacity
                      style={styles.teamMiniCard}
                      onPress={() =>
                        navigation.navigate("TeamDetail", { teamId: team.id })
                      }
                      activeOpacity={0.85}
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
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
