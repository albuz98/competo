import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View, Text } from "react-native";
import { colorGradient, colors } from "../../../theme/colors";
import { tds } from "../TeamDetail.styles";
import { TeamTab } from "../../../types/team";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamGoalScorers } from "../../../api/teams";
import { queryKeys } from "../../../lib/queryKeys";
import { useAuth } from "../../../context/AuthContext";

export const ClassificationGoleador = ({
  teamId,
  activeTab,
}: {
  teamId: number;
  activeTab: TeamTab;
}) => {
  const { user } = useAuth();

  const { data: goalScorers = [], isLoading: loadingScorers } = useQuery({
    queryKey: queryKeys.teamGoalScorers(teamId),
    queryFn: () => fetchTeamGoalScorers(teamId, user!.token),
    enabled: !!user && activeTab === TeamTab.CLASSIFICATION_GOLEADOR,
  });

  return (
    <View style={{ marginTop: 16 }}>
      {loadingScorers ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <View style={tds.section}>
          <Text style={tds.sectionTitle}>Classifica marcatori</Text>
          {goalScorers.length === 0 ? (
            <Text style={tds.emptyText}>Nessun gol registrato</Text>
          ) : (
            goalScorers.map((scorer, idx) => (
              <View key={scorer.playerId} style={tds.scorerRow}>
                <View style={tds.scorerRankBox}>
                  <Text style={tds.scorerRank}>{idx + 1}</Text>
                </View>
                <View style={tds.scorerAvatar}>
                  <LinearGradient
                    colors={colorGradient}
                    style={tds.scorerAvatarGradient}
                  >
                    <Text style={tds.scorerAvatarText}>
                      {scorer.playerName.slice(0, 2).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
                <Text style={tds.scorerName} numberOfLines={1}>
                  {scorer.playerName}
                </Text>
                <View style={tds.scorerGoalsBadge}>
                  <Ionicons name="football" size={12} color={colors.primary} />
                  <Text style={tds.scorerGoals}>{scorer.goals}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};
