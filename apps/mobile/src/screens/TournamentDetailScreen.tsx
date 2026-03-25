import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, Tournament } from "../types";
import { fetchTournament } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useNotifications } from "../context/NotificationsContext";
import { styles } from "../styles/TournamentDetailScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "TournamentDetail">;

const STATUS_LABEL: Record<string, string> = {
  upcoming: "In arrivo",
  ongoing: "In corso",
  completed: "Terminato",
};
const STATUS_COLOR: Record<string, string> = {
  upcoming: "#3b82f6",
  ongoing: "#10b981",
  completed: "#6b7280",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={16} color="#E8601A" style={{ width: 22 }} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function TournamentDetailScreen({ route, navigation }: Props) {
  const { tournamentId, justRegistered } = route.params;
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite, wasAddedWhenFull } = useFavorites();
  const { addNotification } = useNotifications();
  const insets = useSafeAreaInsets();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favorited = tournament ? isFavorite(tournament.id) : false;
  const toggleFavorite = () => {
    if (!tournament) return;
    if (tournament.isRegistered || tournament.status === 'completed') return;
    favorited ? removeFavorite(tournament.id) : addFavorite(tournament);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchTournament(tournamentId)
      .then((t) => {
        setTournament(t);
        // Auto-remove from favorites if user is registered or tournament is over
        if ((t.isRegistered || t.status === 'completed') && isFavorite(t.id)) {
          removeFavorite(t.id);
        }
        // Notify if a spot opened for a full-when-added tournament
        const spotsAvail = t.maxParticipants - t.currentParticipants;
        if (spotsAvail > 0 && isFavorite(t.id) && wasAddedWhenFull(t.id)) {
          addNotification({
            title: 'Posto disponibile!',
            body: `Si è liberato un posto nel torneo "${t.name}". Iscriviti ora!`,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Errore nel caricamento"))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  useEffect(() => {
    if (justRegistered) {
      removeFavorite(tournamentId);
      setTournament((prev) =>
        prev ? { ...prev, isRegistered: true, currentParticipants: prev.currentParticipants + 1 } : prev,
      );
    }
  }, [justRegistered]);

  const handleGoToPayment = () => {
    if (!tournament) return;
    navigation.navigate("TeamSelect", {
      tournamentId: tournament.id,
      entryFee: tournament.entryFee,
      tournamentName: tournament.name,
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (error || !tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Torneo non trovato"}</Text>
      </View>
    );
  }

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

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;
  const isFull = spotsLeft <= 0;
  const isCompleted = tournament.status === "completed";
  const fillPercent = Math.min(
    (tournament.currentParticipants / tournament.maxParticipants) * 100,
    100,
  );

  const canSignUp = !tournament.isRegistered && !isFull && !isCompleted && !!user;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Orange gradient header ──────────────────── */}
        <LinearGradient colors={["#E8601A", "#F5A020"]} style={styles.header}>
          <SafeAreaView edges={["top"]}>
            {/* Back + Status */}
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLOR[tournament.status] },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {STATUS_LABEL[tournament.status]}
                  </Text>
                </View>
                {!tournament.isRegistered && tournament.status !== 'completed' && (
                  <TouchableOpacity
                    onPress={toggleFavorite}
                    style={styles.bookmarkBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={favorited ? 'bookmark' : 'bookmark-outline'} size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Game + Name */}
            <View style={styles.headerContent}>
              <Text style={styles.headerGame}>{tournament.game}</Text>
              <Text style={styles.headerTitle}>{tournament.name}</Text>
            </View>

            {/* Stats chips */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Ionicons name="trophy-outline" size={13} color="#fff" />
                <Text style={styles.chipText}>{tournament.prizePool}</Text>
              </View>
              <View style={styles.chip}>
                <Ionicons name="people-outline" size={13} color="#fff" />
                <Text style={styles.chipText}>
                  {tournament.currentParticipants}/{tournament.maxParticipants}
                </Text>
              </View>
              <View style={styles.chip}>
                <Ionicons name="location-outline" size={13} color="#fff" />
                <Text style={styles.chipText} numberOfLines={1}>
                  {tournament.location}
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── White body ─────────────────────────────── */}
        <View style={styles.body}>

          {/* Info */}
          <SectionCard title="Informazioni">
            <Row icon="business-outline" label="Organizzatore" value={tournament.organizer} />
            <Row icon="location-outline" label="Sede" value={tournament.location} />
            <Row icon="calendar-outline" label="Inizio" value={startDate} />
            <Row icon="flag-outline" label="Fine" value={endDate} />
          </SectionCard>

          {/* Participants */}
          <SectionCard title="Partecipanti">
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${fillPercent}%` as any }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {tournament.currentParticipants} iscritti
              </Text>
              <Text style={styles.progressText}>
                {isFull ? "Al completo" : `${spotsLeft} posti liberi`}
              </Text>
            </View>
          </SectionCard>

          {/* Description */}
          <SectionCard title="Descrizione">
            <Text style={styles.description}>{tournament.description}</Text>
          </SectionCard>

          {/* Rules */}
          <SectionCard title="Regolamento">
            {tournament.rules.map((rule, i) => (
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
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <View style={styles.costBlock}>
          <Text style={styles.costLabel}>Quota iscrizione</Text>
          <Text style={styles.costValue}>{tournament.entryFee}</Text>
        </View>

        {tournament.isRegistered ? (
          <View style={styles.registeredBtn}>
            <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            <Text style={styles.registeredBtnText}>Iscritto</Text>
          </View>
        ) : isCompleted ? (
          <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
            <Text style={styles.actionBtnText}>Terminato</Text>
          </View>
        ) : isFull ? (
          <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
            <Text style={styles.actionBtnText}>Al completo</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, !canSignUp && styles.actionBtnDisabled]}
            onPress={handleGoToPayment}
            disabled={!canSignUp}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Iscriviti</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
