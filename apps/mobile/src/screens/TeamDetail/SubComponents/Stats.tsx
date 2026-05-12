import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { queryKeys } from "../../../lib/queryKeys";
import { fetchTeamStats } from "../../../api/teams";
import { useQuery } from "@tanstack/react-query";
import { TeamTab } from "../../../types/team";
import { useAuth } from "../../../context/AuthContext";
import { colors } from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { tds } from "../TeamDetail.styles";

export const Stats = ({
  teamId,
  activeTab,
}: {
  teamId: number;
  activeTab: TeamTab;
}) => {
  const { user } = useAuth();

  const { data: teamStats, isLoading: loadingStats } = useQuery({
    queryKey: queryKeys.teamStats(teamId),
    queryFn: () => fetchTeamStats(teamId, user!.token),
    enabled: !!user && activeTab === TeamTab.STATS,
  });

  return (
    <View style={{ marginTop: 16 }}>
      {loadingStats ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : teamStats ? (
        <View style={tds.statsCard}>
          <View style={tds.statsCardInner}>
            <View style={tds.statsRow}>
              <View style={tds.statBubble}>
                <Text style={[tds.statNum, { color: colors.success }]}>
                  {teamStats.wins}
                </Text>
                <Text style={tds.statLabel}>Vittorie</Text>
              </View>
              <View style={tds.statDivider} />
              <View style={tds.statBubble}>
                <Text style={[tds.statNum, { color: colors.placeholder }]}>
                  {teamStats.draws}
                </Text>
                <Text style={tds.statLabel}>Pareggi</Text>
              </View>
              <View style={tds.statDivider} />
              <View style={tds.statBubble}>
                <Text style={[tds.statNum, { color: colors.danger }]}>
                  {teamStats.losses}
                </Text>
                <Text style={tds.statLabel}>Sconfitte</Text>
              </View>
            </View>
            <View style={tds.statsTourneyRow}>
              <View style={tds.statTourney}>
                <Ionicons
                  name="trophy-outline"
                  size={18}
                  color={colors.primaryGradientMid}
                />
                <Text style={tds.statTourneyNum}>
                  {teamStats.tournamentsWon}
                </Text>
                <Text style={tds.statTourneyLabel}>Tornei vinti</Text>
              </View>
              <View style={tds.statTourneyDivider} />
              <View style={tds.statTourney}>
                <Ionicons
                  name="medal-outline"
                  size={18}
                  color={colors.placeholder}
                />
                <Text style={tds.statTourneyNum}>
                  {teamStats.tournamentsPlayed}
                </Text>
                <Text style={tds.statTourneyLabel}>Tornei giocati</Text>
              </View>
              <View style={tds.statTourneyDivider} />
              <View style={tds.statTourney}>
                <Ionicons
                  name="football-outline"
                  size={18}
                  color={colors.placeholder}
                />
                <Text style={tds.statTourneyNum}>
                  {teamStats.matchesPlayed}
                </Text>
                <Text style={tds.statTourneyLabel}>Partite totali</Text>
              </View>
            </View>
            <View
              style={[
                tds.statsTourneyRow,
                { borderTopWidth: 1, borderTopColor: colors.gray },
              ]}
            >
              <View style={tds.statTourney}>
                <Ionicons name="football" size={18} color={colors.primary} />
                <Text style={[tds.statTourneyNum, { color: colors.primary }]}>
                  {teamStats.goalsScored}
                </Text>
                <Text style={tds.statTourneyLabel}>Gol segnati</Text>
              </View>
              <View style={tds.statTourneyDivider} />
              <View style={tds.statTourney}>
                <View style={tds.cardIndicatorYellow} />
                <Text style={tds.statTourneyNum}>{teamStats.yellowCards}</Text>
                <Text style={tds.statTourneyLabel}>Gialli</Text>
              </View>
              <View style={tds.statTourneyDivider} />
              <View style={tds.statTourney}>
                <View style={tds.cardIndicatorRed} />
                <Text style={tds.statTourneyNum}>{teamStats.redCards}</Text>
                <Text style={tds.statTourneyLabel}>Rossi</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};
