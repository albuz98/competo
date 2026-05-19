import React, { useState } from "react";
import { View, Text, Pressable, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { RootStackParamList, NavigationEnum } from "../../types/navigation";
import { colorGradient, colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { fetchWalletData } from "../../api/wallet";
import { fetchStatsOverview } from "../../api/stats";
import { queryKeys } from "../../lib/queryKeys";
import { pf } from "./Wallet.styled";

const WALLET_ACTIONS = [
  { icon: "add-outline" as const, label: "Aggiungi" },
  { icon: "business-outline" as const, label: "Coordinate" },
  { icon: "arrow-forward-outline" as const, label: "Sposta" },
  { icon: "ellipsis-horizontal" as const, label: "Altro" },
];

function formatBalance(amount: number): string {
  return amount.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "€";
}

function formatViews(n: number): string {
  return n.toLocaleString("it-IT");
}

export const Wallet = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hideBalance, setHideBalance] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const token = user?.token ?? "";

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: queryKeys.wallet(),
    queryFn: () => fetchWalletData(token),
    enabled: !!token,
  });

  const { data: statsOverview, isLoading: statsLoading } = useQuery({
    queryKey: queryKeys.statsOverview(),
    queryFn: () => fetchStatsOverview(token),
    enabled: !!token,
  });

  const statMetrics = statsOverview
    ? [
        { label: "Utenti", value: formatViews(statsOverview.usersReached), up: statsOverview.usersReachedDelta >= 0 },
        { label: "Clienti", value: statsOverview.newClientsDelta >= 0 ? `+${statsOverview.newClients}` : `${statsOverview.newClients}`, up: statsOverview.newClientsDelta >= 0 },
        { label: "Link", value: formatViews(statsOverview.linkTouches), up: statsOverview.linkTouchesDelta >= 0 },
      ]
    : [];

  return (
    <SafeAreaView
      style={[pf.root, { paddingBottom: 60 + insets.bottom + 8 + 8 }]}
      edges={["top"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* ── PORTAFOGLIO ────────────────────────────────────────── */}
      <View style={pf.section}>
        <LinearGradient colors={colorGradient} style={pf.gradient}>
          <View style={pf.walletTopRow}>
            <Text style={pf.walletLabel}>Account Balance</Text>
            <Pressable
              style={pf.eyeBtn}
              onPress={() => setHideBalance((v) => !v)}
            >
              <Ionicons
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.white}
              />
            </Pressable>
          </View>

          {walletLoading ? (
            <ActivityIndicator color={colors.white} style={{ marginBottom: 8 }} />
          ) : (
            <Text style={hideBalance ? pf.walletAmountHidden : pf.walletAmount}>
              {hideBalance ? "••••••" : formatBalance(walletData?.balance ?? 0)}
            </Text>
          )}

          <View style={pf.ibanRow}>
            <Ionicons name="copy-outline" size={14} color={colors.white} />
            <Text style={pf.ibanText}>{walletData?.iban ?? "—"}</Text>
          </View>

          {/* Icon action buttons */}
          <View style={pf.walletActionRow}>
            {WALLET_ACTIONS.map((a) => (
              <Pressable key={a.label} style={pf.walletActionBtn}>
                <View style={pf.walletActionIcon}>
                  <Ionicons name={a.icon} size={20} color={colors.white} />
                </View>
                <Text style={pf.walletActionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={pf.navBtnRow}>
            <Pressable
              style={pf.navBtn}
              onPress={() => navigation.navigate(NavigationEnum.WALLET_DETAIL)}
            >
              <Text style={pf.navBtnText}>Apri portafoglio</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color={colors.white}
              />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      {/* ── STATISTICHE ────────────────────────────────────────── */}
      <View style={pf.sectionLast}>
        <LinearGradient colors={colorGradient} style={pf.gradient}>
          <View style={pf.statsTopRow}>
            <View>
              <Text style={pf.statsViewsLabel}>Visualizzazioni</Text>
              {statsLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={pf.statsViewsCount}>
                  {formatViews(statsOverview?.views ?? 0)}
                </Text>
              )}
              <Text style={pf.statsViewsSub}>negli ultimi 30 giorni</Text>
            </View>
            <Pressable style={pf.promuoviBtn}>
              <Text style={pf.promuoviText}>Promuovi</Text>
            </Pressable>
          </View>

          {/* Metric mini-cards */}
          <View style={pf.statMetricRow}>
            {statMetrics.map((m) => (
              <View key={m.label} style={pf.statMetricPill}>
                <View
                  style={[
                    pf.statMetricBadge,
                    m.up ? pf.statMetricBadgeUp : pf.statMetricBadgeDown,
                  ]}
                >
                  <Ionicons
                    name={
                      m.up ? "trending-up-outline" : "trending-down-outline"
                    }
                    size={11}
                    color={colors.white}
                  />
                </View>
                <Text style={pf.statMetricValue}>{m.value}</Text>
                <Text style={pf.statMetricLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          <View style={pf.navBtnRow}>
            <Pressable
              style={pf.navBtn}
              onPress={() => navigation.navigate(NavigationEnum.STATS_DETAIL)}
            >
              <Text style={pf.navBtnText}>Apri statistiche</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color={colors.white}
              />
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};
