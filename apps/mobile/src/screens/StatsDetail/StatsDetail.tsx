import React from "react";
import { View, Text, Pressable, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, G } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { colorGradient, colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { fetchStatsOverview, fetchStatsSegments } from "../../api/stats";
import { queryKeys } from "../../lib/queryKeys";
import { OrganizerStatsSegment } from "../../types/stats";
import { sd } from "./StatsDetail.styled";

// ── DonutChart ───────────────────────────────────────────────────────────────

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function DonutChart({ size, segments }: { size: number; segments: OrganizerStatsSegment[] }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.26;
  let start = 0;

  return (
    <Svg width={size} height={size}>
      {segments.map((seg, i) => {
        const sweep = (seg.percentage / 100) * 360;
        const end = start + sweep;
        const large = sweep > 180 ? 1 : 0;
        const o1 = polarToXY(cx, cy, outerR, start);
        const o2 = polarToXY(cx, cy, outerR, end);
        const i1 = polarToXY(cx, cy, innerR, end);
        const i2 = polarToXY(cx, cy, innerR, start);
        const d = [
          `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
          `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
          `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
          `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
          "Z",
        ].join(" ");
        start = end;
        return <G key={i}><Path d={d} fill={seg.color} /></G>;
      })}
    </Svg>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

function formatDelta(delta: number): string {
  return delta >= 0 ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`;
}

function formatViews(n: number): string {
  return n.toLocaleString("it-IT");
}

export default function StatsDetail() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const token = user?.token ?? "";

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: queryKeys.statsOverview(),
    queryFn: () => fetchStatsOverview(token),
    enabled: !!token,
  });

  const { data: segments, isLoading: segmentsLoading } = useQuery({
    queryKey: queryKeys.statsSegments(),
    queryFn: () => fetchStatsSegments(token),
    enabled: !!token,
  });

  const metrics = overview
    ? [
        { label: "Visualizzazioni", value: formatViews(overview.views), delta: formatDelta(overview.viewsDelta), up: overview.viewsDelta >= 0 },
        { label: "Utenti raggiunti", value: formatViews(overview.usersReached), delta: formatDelta(overview.usersReachedDelta), up: overview.usersReachedDelta >= 0 },
        { label: "Nuovi clienti", value: String(overview.newClients), delta: formatDelta(overview.newClientsDelta), up: overview.newClientsDelta >= 0 },
        { label: "Tocchi su link", value: formatViews(overview.linkTouches), delta: formatDelta(overview.linkTouchesDelta), up: overview.linkTouchesDelta >= 0 },
      ]
    : [];

  return (
    <SafeAreaView style={sd.root} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* ── Gradient header ─────────────────────────────── */}
      <LinearGradient colors={colorGradient} style={sd.header}>
        <View style={sd.topBar}>
          <Pressable style={sd.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={sd.topBarTitle}>Statistiche</Text>
          <Pressable style={sd.settingsBtn}>
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </Pressable>
        </View>

        <View style={sd.headerSummary}>
          <View>
            <Text style={sd.viewsLabel}>Visualizzazioni</Text>
            {overviewLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={sd.viewsCount}>{formatViews(overview?.views ?? 0)}</Text>
            )}
            <Text style={sd.viewsSub}>negli ultimi 30 giorni</Text>
          </View>
          <Pressable style={sd.promuoviBtn}>
            <Text style={sd.promuoviText}>Promuovi</Text>
          </Pressable>
        </View>

        {overview && (
          <View style={sd.deltaBadge}>
            <Ionicons
              name={overview.viewsDelta >= 0 ? "trending-up-outline" : "trending-down-outline"}
              size={12}
              color={colors.white}
            />
            <Text style={sd.deltaText}>
              {formatDelta(overview.viewsDelta)} vs mese scorso
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* ── Content area ─────────────────── */}
      <View style={sd.content}>
        {/* Chart card */}
        <View style={sd.card}>
          <View style={sd.cardHeader}>
            <View>
              <Text style={sd.cardTitle}>Utenti raggiunti</Text>
              <Text style={sd.cardSubTitle}>{overview?.month ?? "—"}</Text>
            </View>
            <Pressable style={sd.periodBtn}>
              <Text style={sd.periodText}>Mese</Text>
              <Ionicons name="chevron-down" size={12} color={colors.placeholder} />
            </Pressable>
          </View>

          <View style={sd.chartBody}>
            {segmentsLoading || !segments ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <DonutChart size={150} segments={segments} />
                <View style={sd.legend}>
                  {segments.map((seg) => (
                    <View key={seg.label} style={sd.legendItem}>
                      <View
                        style={[
                          sd.legendDot,
                          {
                            backgroundColor: seg.color,
                            borderWidth: seg.color === colors.gray ? 1 : 0,
                            borderColor: colors.grayDark,
                          },
                        ]}
                      />
                      <View style={sd.legendText}>
                        <Text style={sd.legendLabel}>{seg.label}</Text>
                        <Text style={sd.legendCount}>{seg.count.toLocaleString("it-IT")}</Text>
                      </View>
                      <Text style={sd.legendPct}>
                        {seg.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Metrics grid */}
        <Text style={sd.sectionTitle}>Dati statistici</Text>
        {overviewLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />
        ) : (
          <View style={sd.metricsGrid}>
            {metrics.map((m) => (
              <View key={m.label} style={sd.metricCard}>
                <View style={sd.metricTopRow}>
                  <Text style={sd.metricLabel}>{m.label}</Text>
                  <View style={m.up ? sd.deltaUp : sd.deltaDown}>
                    <Ionicons
                      name={m.up ? "arrow-up" : "arrow-down"}
                      size={10}
                      color={m.up ? colors.success : colors.danger}
                    />
                    <Text
                      style={[
                        sd.metricDelta,
                        { color: m.up ? colors.success : colors.danger },
                      ]}
                    >
                      {m.delta}
                    </Text>
                  </View>
                </View>
                <Text style={sd.metricValue}>{m.value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
