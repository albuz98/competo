import React, { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors } from "../../../theme/colors";
import { TeamTab, TeamTournamentRecord } from "../../../types/team";
import { RESULT_CONFIG, TournamentResult } from "../../../constants/tournament";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamTournaments } from "../../../api/teams";
import { queryKeys } from "../../../lib/queryKeys";
import { tds } from "../TeamDetail.styles";
import { useAuth } from "../../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export const Tournaments = ({
  teamId,
  activeTab,
}: {
  teamId: number;
  activeTab: TeamTab;
}) => {
  const { user } = useAuth();
  const [expandedTournaments, setExpandedTournaments] = useState<Set<string>>(
    new Set(),
  );

  const { data: teamTournaments = [], isLoading: loadingTournaments } =
    useQuery({
      queryKey: queryKeys.teamTournaments(teamId),
      queryFn: () => fetchTeamTournaments(teamId, user!.token),
      enabled: !!user && activeTab === TeamTab.TOURNAMENTS,
    });

  const toggleTournament = (id: string) => {
    setExpandedTournaments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={{ marginTop: 16 }}>
      {loadingTournaments ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : teamTournaments.length === 0 ? (
        <Text style={[tds.emptyText, { marginHorizontal: 16 }]}>
          Nessun torneo giocato
        </Text>
      ) : (
        teamTournaments
          .sort(
            (a: TeamTournamentRecord, b: TeamTournamentRecord) =>
              new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((t: TeamTournamentRecord) => {
            const cfg = RESULT_CONFIG[t.result];
            const expanded = expandedTournaments.has(t.id);
            return (
              <View key={t.id} style={tds.tournamentAccordion}>
                <TouchableOpacity
                  style={tds.tournamentAccordionHeader}
                  onPress={() => toggleTournament(t.id)}
                  activeOpacity={0.7}
                >
                  <View style={tds.tournamentAccordionIcon}>
                    <Text style={tds.tournamentAccordionIconText}>
                      {t.result === TournamentResult.WON
                        ? "🥇"
                        : t.result === TournamentResult.SECOND
                          ? "🥈"
                          : t.result === TournamentResult.THIRD
                            ? "🥉"
                            : "💔"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={tds.tournamentAccordionName} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={tds.tournamentAccordionMeta}>
                      {new Date(t.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {t.location}
                    </Text>
                  </View>
                  <View
                    style={[
                      tds.tournamentBadge,
                      {
                        backgroundColor:
                          t.result === TournamentResult.ELIMINATED
                            ? colors.gray
                            : cfg?.color,
                      },
                    ]}
                  >
                    <Text style={tds.tournamentBadgeText}>{cfg?.label}</Text>
                  </View>
                  <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.placeholder}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>

                {expanded && (
                  <View style={tds.tournamentScorers}>
                    {t.scorers.length === 0 ? (
                      <Text style={tds.emptyText}>Nessun gol</Text>
                    ) : (
                      t.scorers.map((s, i) => (
                        <View
                          key={`${s.playerId}-${i}`}
                          style={tds.tournamentScorerRow}
                        >
                          <Ionicons
                            name="football"
                            size={13}
                            color={colors.primary}
                          />
                          <Text
                            style={tds.tournamentScorerName}
                            numberOfLines={1}
                          >
                            {s.playerName}
                          </Text>
                          <Text style={tds.tournamentScorerGoals}>
                            {s.goals} {s.goals === 1 ? "gol" : "gol"}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })
      )}
    </View>
  );
};
