import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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
  const insets = useSafeAreaInsets();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchTournament(tournamentId)
      .then(setTournament)
      .catch((e) => setError(e instanceof Error ? e.message : "Errore nel caricamento"))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  useEffect(() => {
    if (justRegistered) {
      setTournament((prev) =>
        prev ? { ...prev, isRegistered: true, currentParticipants: prev.currentParticipants + 1 } : prev,
      );
    }
  }, [justRegistered]);

  const handleGoToPayment = () => {
    if (!tournament) return;
    navigation.navigate("Payment", {
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ef4444", fontSize: 14 },

  // Header
  header: { paddingBottom: 28 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  headerContent: { paddingHorizontal: 20, marginBottom: 20 },
  headerGame: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30 },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  // Body
  body: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  rowLabel: { flex: 1, fontSize: 13, color: "#64748b", marginLeft: 2 },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#1e293b", maxWidth: "55%" as any, textAlign: "right" },

  // Progress
  progressBg: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#E8601A", borderRadius: 4 },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressText: { fontSize: 12, color: "#64748b" },

  // Description
  description: { fontSize: 14, color: "#475569", lineHeight: 22 },

  // Rules
  ruleItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10, gap: 10 },
  ruleNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ruleNumberText: { fontSize: 11, fontWeight: "800", color: "#E8601A" },
  ruleText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 20 },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    gap: 16,
  },
  costBlock: {},
  costLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  costValue: { fontSize: 22, fontWeight: "800", color: "#1e293b", marginTop: 2 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#E8601A",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnDisabled: { backgroundColor: "#e2e8f0" },
  actionBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  registeredBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#dcfce7",
    borderRadius: 50,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  registeredBtnText: { color: "#16a34a", fontSize: 15, fontWeight: "800" },
});
