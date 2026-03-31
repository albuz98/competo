import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, TournamentPlayer } from "../../types";
import { pp } from "./PlayerProfile.styles";
import { colorGradient } from "../../theme/colors";
import { ButtonBack } from "../../components/Button/Button";

type Props = NativeStackScreenProps<RootStackParamList, "PlayerProfile">;

const ROLE_LABELS: Record<string, string> = {
  representative: "Referente",
  calciatore: "Calciatore",
  allenatore: "Allenatore",
  portiere: "Portiere",
};

const ROLE_COLORS: Record<string, string> = {
  representative: "#E8601A",
  calciatore: "#3b82f6",
  allenatore: "#8b5cf6",
  portiere: "#10b981",
};

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <View style={pp.statCard}>
      <View style={[pp.statIconCircle, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[pp.statValue, { color }]}>{value}</Text>
      <Text style={pp.statLabel}>{label}</Text>
    </View>
  );
}

export default function PlayerProfileScreen({ route, navigation }: Props) {
  const player: TournamentPlayer = JSON.parse(route.params.playerJson);

  const age = player.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(player.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      )
    : null;

  const initial =
    (player.firstName?.[0] ?? "").toUpperCase() +
    (player.lastName?.[0] ?? "").toUpperCase();

  const roleColor = ROLE_COLORS[player.role] ?? "#64748b";
  const roleLabel = ROLE_LABELS[player.role] ?? player.role;

  return (
    <View style={pp.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Gradient header ── */}
      <LinearGradient colors={colorGradient} style={pp.header}>
        <SafeAreaView edges={["top"]}>
          <ButtonBack handleBtn={() => navigation.goBack()} />
          <View style={pp.avatarCircle}>
            <Text style={pp.avatarInitials}>{initial}</Text>
          </View>
          <Text style={pp.playerName}>
            {player.firstName} {player.lastName}
          </Text>
          <Text style={pp.playerUsername}>@{player.username}</Text>
          <View style={[pp.roleBadge, { backgroundColor: "rgba(0,0,0,0.2)" }]}>
            <Text style={pp.roleText}>{roleLabel}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={pp.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Info card ── */}
        <View style={pp.infoCard}>
          {age !== null && (
            <View style={pp.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color="#94a3b8"
                style={{ width: 26 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={pp.infoLabel}>Età</Text>
                <Text style={pp.infoValue}>{age} anni</Text>
              </View>
            </View>
          )}
          <View style={[pp.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons
              name="person-outline"
              size={18}
              color="#94a3b8"
              style={{ width: 26 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={pp.infoLabel}>Ruolo</Text>
              <Text style={[pp.infoValue, { color: roleColor }]}>
                {roleLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Stats ── */}
        <Text style={pp.sectionTitle}>Statistiche</Text>
        <View style={pp.statsGrid}>
          <StatCard
            label="Gol"
            value={player.stats.goals}
            icon="football-outline"
            color="#E8601A"
          />
          <StatCard
            label="Partite"
            value={player.stats.matchesPlayed}
            icon="trophy-outline"
            color="#3b82f6"
          />
          <StatCard
            label="Gialli"
            value={player.stats.yellowCards}
            icon="card-outline"
            color="#f59e0b"
          />
          <StatCard
            label="Rossi"
            value={player.stats.redCards}
            icon="card-outline"
            color="#ef4444"
          />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
