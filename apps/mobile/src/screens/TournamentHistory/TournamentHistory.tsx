import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";
import { TournamentResult } from "../../constants/tournament";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { ButtonIcon } from "../../components/Button/Button";
import { ths } from "./TournamentHistory.styles";
import { RESULT_CONFIG } from "../../constants/tournament";

type Props = NativeStackScreenProps<RootStackParamList, "TournamentHistory">;

export default function TournamentHistoryScreen({ navigation }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const sorted = [...(user?.playedTournaments ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <View style={ths.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={ths.header}>
          <ButtonIcon
            handleBtn={() => navigation.goBack()}
            style={ths.backBtn}
            icon={
              <Ionicons name="chevron-back" size={24} color={colors.dark} />
            }
          />
          <Text style={ths.headerTitle}>Storico tornei</Text>
        </View>

        {sorted.length === 0 ? (
          <View style={ths.emptyBox}>
            <View style={ths.emptyIcon}>
              <Ionicons
                name="trophy-outline"
                size={48}
                color={colors.grayDark}
              />
            </View>
            <Text style={ths.emptyTitle}>Nessun torneo</Text>
            <Text style={ths.emptySub}>
              I tornei a cui hai partecipato appariranno qui.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              ths.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {sorted.map((t) => {
              const cfg = RESULT_CONFIG[t.result];
              return (
                <View key={t.id} style={ths.card}>
                  <View style={ths.iconBox}>
                    <Text style={ths.iconText}>
                      {t.result === TournamentResult.WON
                        ? "🥇"
                        : t.result === TournamentResult.SECOND
                          ? "🥈"
                          : t.result === TournamentResult.THIRD
                            ? "🥉"
                            : "💔"}
                    </Text>
                  </View>
                  <View style={ths.info}>
                    <Text style={ths.name} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={ths.meta}>
                      {new Date(t.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {t.location}
                    </Text>
                    <Text style={ths.team}>{t.teamName}</Text>
                  </View>
                  <View
                    style={[
                      ths.badge,
                      {
                        backgroundColor:
                          t.result === TournamentResult.ELIMINATED
                            ? colors.white
                            : cfg?.color,
                      },
                    ]}
                  >
                    <Text style={ths.badgeText}>{cfg?.label}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
