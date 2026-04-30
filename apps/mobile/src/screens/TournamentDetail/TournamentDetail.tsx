import React, { useEffect, useLayoutEffect } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Modal,
  Linking,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  NavigationEnum,
  type RootStackParamList,
} from "../../types/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTournament } from "../../api/tournaments";
import { queryKeys } from "../../lib/queryKeys";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNotifications } from "../../context/NotificationsContext";
import { styles } from "./TournamentDetail.styles";
import {
  ButtonBack,
  ButtonFullColored,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { colorGradient, colors } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TournamentDetail">;

const STATUS_LABEL: Record<string, string> = {
  upcoming: "In arrivo",
  ongoing: "In corso",
  completed: "Terminato",
};
const STATUS_COLOR: Record<string, string> = {
  upcoming: colors.purpleBlue,
  ongoing: colors.success,
  completed: colors.placeholder,
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.primaryGradientMid}
        style={{ width: 22 }}
      />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function LocationRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.primaryGradientMid}
        style={{ width: 22 }}
      />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValueLink}>{value}</Text>
    </TouchableOpacity>
  );
}

export default function TournamentDetail({ route, navigation }: Props) {
  const { tournamentId, justRegistered } = route.params;
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, wasAddedWhenFull } =
    useFavorites();
  const { addNotification } = useNotifications();
  const insets = useSafeAreaInsets();
  const [showMapsModal, setShowMapsModal] = React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const {
    data: tournament,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: queryKeys.tournament(tournamentId),
    queryFn: () => fetchTournament(tournamentId),
  });

  // Side-effects that run once the tournament data is loaded
  useEffect(() => {
    if (!tournament) return;
    if (
      (tournament.isRegistered || tournament.status === "completed") &&
      isFavorite(tournament.id)
    ) {
      removeFavorite(tournament.id);
    }
    const spotsAvail =
      tournament.maxParticipants - tournament.currentParticipants;
    if (
      spotsAvail > 0 &&
      isFavorite(tournament.id) &&
      wasAddedWhenFull(tournament.id)
    ) {
      addNotification({
        title: "Posto disponibile!",
        body: `Si è liberato un posto nel torneo "${tournament.name}". Iscriviti ora!`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [tournament?.id]);

  // justRegistered: mark locally as registered (avoids a full refetch)
  useEffect(() => {
    if (justRegistered) {
      removeFavorite(tournamentId);
    }
  }, [justRegistered]);

  const favorited = tournament ? isFavorite(tournament.id) : false;
  const toggleFavorite = () => {
    if (!tournament) return;
    if (tournament.isRegistered || tournament.status === "completed") return;
    favorited ? removeFavorite(tournament.id) : addFavorite(tournament);
  };

  const openMaps = () => {
    setShowMapsModal(false);
    const query = encodeURIComponent(displayTournament.location);
    const url =
      displayTournament.lat && displayTournament.lng
        ? Platform.select({
            ios: `maps://maps.apple.com/?ll=${displayTournament.lat},${displayTournament.lng}&q=${query}`,
            android: `geo:${displayTournament.lat},${displayTournament.lng}?q=${query}`,
          })
        : Platform.select({
            ios: `maps://maps.apple.com/?q=${query}`,
            android: `geo:0,0?q=${query}`,
          });
    if (url) {
      Linking.openURL(url).catch(() =>
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
        ),
      );
    }
  };

  const handleGoToPayment = () => {
    const profileComplete = !!(
      user?.first_name &&
      user?.last_name &&
      user?.birthdate
    );
    if (!profileComplete) {
      Alert.alert(
        "Profilo incompleto",
        "Per iscriverti a un torneo devi inserire nome, cognome e data di nascita nel tuo profilo.",
        [
          { text: "Annulla", style: "cancel" },
          {
            text: "Vai al profilo",
            onPress: () =>
              (navigation as any).navigate(NavigationEnum.MAIN_TABS, {
                screen: NavigationEnum.PROFILE,
                params: { startEdit: true },
              }),
          },
        ],
      );
      return;
    }
    navigation.navigate(NavigationEnum.TEAM_SELECT, {
      tournamentId: displayTournament.id,
      entryFee: displayTournament.entryFee,
      tournamentName: displayTournament.name,
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={colorGradient} style={styles.center}>
        <ActivityIndicator size="large" color={colors.white} />
      </LinearGradient>
    );
  }

  if (queryError || !tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {queryError instanceof Error
            ? queryError.message
            : "Torneo non trovato"}
        </Text>
      </View>
    );
  }

  // When justRegistered, reflect the state locally without a round trip
  const displayTournament = justRegistered
    ? {
        ...tournament,
        isRegistered: true,
        currentParticipants: tournament.currentParticipants + 1,
      }
    : tournament;

  const startDate = new Date(tournament.startDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const endDate = new Date(tournament.endDate).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const spotsLeft =
    displayTournament.maxParticipants - displayTournament.currentParticipants;
  const isFull = spotsLeft <= 0;
  const isCompleted = displayTournament.status === "completed";
  const fillPercent = Math.min(
    (displayTournament.currentParticipants /
      displayTournament.maxParticipants) *
      100,
    100,
  );

  const canSignUp =
    !displayTournament.isRegistered && !isFull && !isCompleted && !!user;

  const btnText = (): string => {
    if (displayTournament.isRegistered) return "Iscritto";
    if (isFull) return "Terminato";
    if (isCompleted) return "Al completo";
    return "Iscriviti";
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Orange gradient header ──────────────────── */}
        <LinearGradient colors={colorGradient} style={styles.header}>
          <SafeAreaView edges={["top"]}>
            {/* Back + Status */}
            <View style={styles.headerTop}>
              <ButtonBack handleBtn={() => navigation.goBack()} />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLOR[displayTournament.status] },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {STATUS_LABEL[displayTournament.status]}
                  </Text>
                </View>
                {!displayTournament.isRegistered &&
                  displayTournament.status !== "completed" && (
                    <ButtonIcon
                      handleBtn={toggleFavorite}
                      style={styles.bookmarkBtn}
                      icon={
                        <Ionicons
                          name={favorited ? "bookmark" : "bookmark-outline"}
                          size={20}
                          color={colors.white}
                        />
                      }
                    />
                  )}
              </View>
            </View>

            {/* Game + Name */}
            <View style={styles.headerContent}>
              <Text style={styles.headerGame}>{displayTournament.game}</Text>
              <Text style={styles.headerTitle}>{displayTournament.name}</Text>
            </View>

            {/* Stats chips */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Ionicons
                  name="trophy-outline"
                  size={13}
                  color={colors.white}
                />
                <Text style={styles.chipText}>
                  {displayTournament.prizePool}
                </Text>
              </View>
              <View style={styles.chip}>
                <Ionicons
                  name="people-outline"
                  size={13}
                  color={colors.white}
                />
                <Text style={styles.chipText}>
                  {displayTournament.currentParticipants}/
                  {displayTournament.maxParticipants}
                </Text>
              </View>
              <View style={styles.chip}>
                <Ionicons
                  name="location-outline"
                  size={13}
                  color={colors.white}
                />
                <Text style={styles.chipText} numberOfLines={1}>
                  {displayTournament.location}
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── White body ─────────────────────────────── */}
        <View style={styles.body}>
          {/* Info */}
          <SectionCard title="Informazioni">
            <Row
              icon="business-outline"
              label="Organizzatore"
              value={displayTournament.organizer}
            />
            <LocationRow
              icon="location-outline"
              label="Sede"
              value={displayTournament.location}
              onPress={() => setShowMapsModal(true)}
            />
            <Row icon="calendar-outline" label="Inizio" value={startDate} />
            <Row icon="flag-outline" label="Fine" value={endDate} />
          </SectionCard>

          {/* Participants */}
          <SectionCard title="Partecipanti">
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${fillPercent}%` as any },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {displayTournament.currentParticipants} iscritti
              </Text>
              <Text style={styles.progressText}>
                {isFull ? "Al completo" : `${spotsLeft} posti liberi`}
              </Text>
            </View>
          </SectionCard>

          {/* Description */}
          <SectionCard title="Descrizione">
            <Text style={styles.description}>
              {displayTournament.description}
            </Text>
          </SectionCard>

          {/* Rules */}
          <SectionCard title="Regolamento">
            {displayTournament.rules.map((rule, i) => (
              <View key={i} style={styles.ruleItem}>
                <View style={styles.ruleNumber}>
                  <Text style={styles.ruleNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </SectionCard>
        </View>
      </ScrollView>

      {/* ── Fixed bottom bar ───────────────────────── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.costBlock}>
          <Text style={styles.costLabel}>Quota iscrizione</Text>
          <Text style={styles.costValue}>{displayTournament.entryFee}</Text>
        </View>

        <ButtonFullColored
          text={btnText()}
          handleBtn={handleGoToPayment}
          isDisabled={!canSignUp}
          isColored
        />
      </View>

      <Modal
        visible={showMapsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMapsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMapsModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Apri in Maps</Text>
            <Text style={styles.modalBody}>
              Vuoi aprire Maps per vedere la posizione del torneo?
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowMapsModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnOpen} onPress={openMaps}>
                <Text style={styles.modalBtnOpenText}>Apri Maps</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
