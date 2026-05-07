import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTeams } from "../../../../context/TeamsContext";
import { useAuth } from "../../../../context/AuthContext";
import { styles } from "../../Profile.styles";
import { pStyles } from "../ProfilePlayer.styled";
import { colorGradient, colors } from "../../../../theme/colors";
import {
  ButtonGeneric,
  ButtonLink,
} from "../../../../components/core/Button/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  RESULT_CONFIG,
  TournamentResult,
} from "../../../../constants/tournament";
import { RootStackParamList } from "../../../../types/navigation";
import { UserRole } from "../../../../types/user";

export const PlayerView = () => {
  const { user, currentProfile } = useAuth();
  const { teams } = useTeams();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const playerProfile =
    currentProfile?.role === UserRole.PLAYER ? currentProfile : undefined;

  if (!user) return;

  return (
    <>
      {/* Statistiche Partite */}
      {user.matchStats && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Statistiche Partite</Text>
          </View>
          <View style={pStyles.statsCard}>
            <View style={pStyles.statsCardInner}>
              <View style={pStyles.statsRow}>
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: colors.success }]}>
                    {user.matchStats.wins}
                  </Text>
                  <Text style={pStyles.statLabel}>Vittorie</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text
                    style={[pStyles.statNum, { color: colors.placeholder }]}
                  >
                    {user.matchStats.draws}
                  </Text>
                  <Text style={pStyles.statLabel}>Pareggi</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: colors.danger }]}>
                    {user.matchStats.losses}
                  </Text>
                  <Text style={pStyles.statLabel}>Sconfitte</Text>
                </View>
              </View>
              <View style={pStyles.statsTourneyRow}>
                <View style={pStyles.statTourney}>
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color={colors.primaryGradientMid}
                  />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.tournamentsWon}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Tornei vinti</Text>
                </View>
                <View style={pStyles.statTourneyDivider} />
                <View style={pStyles.statTourney}>
                  <Ionicons
                    name="medal-outline"
                    size={18}
                    color={colors.placeholder}
                  />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.tournamentsPlayed}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Tornei giocati</Text>
                </View>
                <View style={pStyles.statTourneyDivider} />
                <View style={pStyles.statTourney}>
                  <Ionicons
                    name="football-outline"
                    size={18}
                    color={colors.placeholder}
                  />
                  <Text style={pStyles.statTourneyNum}>
                    {user.matchStats.matchesPlayed}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Partite totali</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Statistiche individuali */}
      {playerProfile?.careerStats && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>
              {playerProfile.careerStats.playerRole === "portiere"
                ? "Statistiche portiere"
                : "Statistiche individuali"}
            </Text>
          </View>
          <View style={pStyles.careerCard}>
            <View style={pStyles.careerCardInner}>
              <View style={pStyles.careerBubble}>
                <Text style={[pStyles.careerNum, { color: colors.primary }]}>
                  {playerProfile.careerStats.playerRole === "portiere"
                    ? (playerProfile.careerStats.goalsConceded ?? 0)
                    : (playerProfile.careerStats.goals ?? 0)}
                </Text>
                <Text style={pStyles.careerLabel}>
                  {playerProfile.careerStats.playerRole === "portiere"
                    ? "Gol subiti"
                    : "Gol"}
                </Text>
              </View>
              <View style={pStyles.careerDivider} />
              <View style={pStyles.careerBubble}>
                <Text
                  style={[
                    pStyles.careerNum,
                    { color: colors.primaryGradientEnd },
                  ]}
                >
                  {playerProfile.careerStats.yellowCards}
                </Text>
                <Text style={pStyles.careerLabel}>Gialli</Text>
              </View>
              <View style={pStyles.careerDivider} />
              <View style={pStyles.careerBubble}>
                <Text style={[pStyles.careerNum, { color: colors.danger }]}>
                  {playerProfile.careerStats.redCards}
                </Text>
                <Text style={pStyles.careerLabel}>Rossi</Text>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Storico tornei */}
      {user.playedTournaments && user.playedTournaments.length > 0 && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Storico tornei</Text>
            {user.playedTournaments.length > 3 && (
              <ButtonLink
                text="Vedi tutti"
                handleBtn={() => navigation.navigate("TournamentHistory")}
                color={colors.primaryGradientMid}
                isColored
                isBold
              />
            )}
          </View>
          {[...user.playedTournaments]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 3)
            .map((t) => {
              const cfg = RESULT_CONFIG[t.result];
              return (
                <View key={t.id} style={pStyles.historyCard}>
                  <View style={pStyles.historyIconBox}>
                    <Text style={pStyles.historyIconText}>
                      {t.result === TournamentResult.WON
                        ? "🥇"
                        : t.result === TournamentResult.SECOND
                          ? "🥈"
                          : t.result === TournamentResult.THIRD
                            ? "🥉"
                            : "💔"}
                    </Text>
                  </View>
                  <View style={pStyles.historyInfo}>
                    <Text style={pStyles.historyName} numberOfLines={1}>
                      {t.name}
                    </Text>
                    <Text style={pStyles.historyMeta}>
                      {new Date(t.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {t.location}
                    </Text>
                    <Text style={pStyles.historyTeam}>{t.teamName}</Text>
                  </View>
                  <View
                    style={[
                      pStyles.historyBadge,
                      {
                        backgroundColor:
                          t.result === TournamentResult.ELIMINATED
                            ? colors.white
                            : cfg?.color,
                      },
                    ]}
                  >
                    <Text style={pStyles.historyBadgeText}>{cfg?.label}</Text>
                  </View>
                </View>
              );
            })}
        </>
      )}

      {/* Le mie squadre */}
      <>
        <View style={styles.teamsHeader}>
          <Text style={styles.teamsTitle}>Le mie squadre</Text>
          <ButtonLink
            text="Vedi tutte"
            handleBtn={() => navigation.navigate("Teams")}
            color={colors.primaryGradientMid}
            isColored
            isBold
          />
        </View>

        {teams.length === 0 ? (
          <ButtonGeneric
            style={styles.createTeamCard}
            handleBtn={() => navigation.navigate("CreateTeam")}
          >
            <LinearGradient
              colors={colorGradient}
              style={styles.createTeamIcon}
            >
              <Ionicons name="add" size={22} color={colors.white} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.createTeamTitle}>Crea una squadra</Text>
              <Text style={styles.createTeamSub}>
                Invita amici e partecipa ai tornei insieme
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.grayDark}
            />
          </ButtonGeneric>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.teamsScroll}
          >
            {teams.slice(0, 5).map((team) => (
              <ButtonGeneric
                key={team.id}
                style={styles.teamMiniCard}
                handleBtn={() =>
                  navigation.navigate("TeamDetail", { teamId: team.id })
                }
              >
                <LinearGradient
                  colors={colorGradient}
                  style={styles.teamMiniAvatar}
                >
                  <Text style={styles.teamMiniAvatarText}>
                    {team.name.slice(0, 2).toUpperCase()}
                  </Text>
                </LinearGradient>
                <Text style={styles.teamMiniName} numberOfLines={2}>
                  {team.name}
                </Text>
                <Text style={styles.teamMiniSport}>{team.sport}</Text>
              </ButtonGeneric>
            ))}
          </ScrollView>
        )}
      </>
    </>
  );
};
