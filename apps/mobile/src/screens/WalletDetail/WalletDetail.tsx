import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { colorGradient, colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { fetchWalletData, fetchTransactions } from "../../api/wallet";
import { queryKeys } from "../../lib/queryKeys";
import { wd } from "./WalletDetail.styled";

const ACTIONS = [
  { icon: "add-outline" as const, label: "Aggiungi" },
  { icon: "business-outline" as const, label: "Coordinate" },
  { icon: "arrow-forward-outline" as const, label: "Sposta" },
  { icon: "ellipsis-horizontal" as const, label: "Altro" },
];

function formatBalance(amount: number): string {
  return amount.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "€";
}

function formatTrend(amount: number): string {
  const sign = amount >= 0 ? "↑ +" : "↓ ";
  return `${sign}${Math.abs(amount).toLocaleString("it-IT")}€ questa settimana`;
}

export default function WalletDetail() {
  const navigation = useNavigation();
  const [hideBalance, setHideBalance] = useState(false);
  const { user } = useAuth();
  const token = user?.token ?? "";

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: queryKeys.wallet(),
    queryFn: () => fetchWalletData(token),
    enabled: !!token,
  });

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: queryKeys.transactions(),
    queryFn: () => fetchTransactions(token),
    enabled: !!token,
  });

  return (
    <SafeAreaView style={wd.root} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      {/* ── Gradient header ─────────────────────────────── */}
      <LinearGradient colors={colorGradient} style={wd.header}>
        <View style={wd.topBar}>
          <Pressable style={wd.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={wd.topBarTitle}>Portafoglio</Text>
          <View style={wd.topBarSpacer} />
        </View>

        <View style={wd.balanceArea}>
          <View style={wd.cardTopRow}>
            <Text style={wd.cardLabel}>Account Balance</Text>
            <Pressable
              style={wd.eyeBtn}
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
            <>
              <Text style={hideBalance ? wd.amountHidden : wd.amount}>
                {hideBalance ? "••••••" : formatBalance(walletData?.balance ?? 0)}
              </Text>
              <Text style={wd.balanceTrend}>
                {formatTrend(walletData?.weeklyTrend ?? 0)}
              </Text>
            </>
          )}
          <View style={wd.ibanRow}>
            <Ionicons name="copy-outline" size={14} color={colors.white} />
            <Text style={wd.ibanText}>{walletData?.iban ?? "—"}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Content area (fixed, gray) ───────────────────── */}
      <View style={wd.content}>
        {/* Action buttons */}
        <View style={wd.actionsCard}>
          {ACTIONS.map((a) => (
            <Pressable key={a.label} style={wd.actionItem}>
              <View style={wd.actionIconWrap}>
                <Ionicons name={a.icon} size={20} color={colors.primary} />
              </View>
              <Text style={wd.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Transactions */}
        <View style={wd.section}>
          <View style={wd.sectionHeader}>
            <Text style={wd.sectionTitle}>Transazioni</Text>
            <Pressable style={wd.filterBtn}>
              <Text style={wd.filterText}>Filtra</Text>
              <Ionicons name="filter-outline" size={14} color={colors.placeholder} />
            </Pressable>
          </View>

          {txLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={wd.txList}
            >
              {(transactions ?? []).map((tx) => (
                <View
                  key={tx.id}
                  style={[wd.txItem, tx.isIncome && wd.txItemIncome]}
                >
                  <View style={[wd.txIcon, tx.isIncome && wd.txIconIncome]}>
                    <Ionicons
                      name={tx.isIncome ? "arrow-down-outline" : "arrow-up-outline"}
                      size={18}
                      color={tx.isIncome ? colors.success : colors.primary}
                    />
                  </View>
                  <View style={wd.txInfo}>
                    <Text style={wd.txName}>{tx.name}</Text>
                    <Text style={wd.txSub}>{tx.sub}</Text>
                  </View>
                  <Text
                    style={[
                      wd.txAmount,
                      { color: tx.isIncome ? colors.success : colors.dark },
                    ]}
                  >
                    {tx.amount}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
