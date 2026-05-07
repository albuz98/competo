import React from "react";
import { ScrollView, View, Text } from "react-native";
import {
  ButtonGeneric,
  ButtonLink,
} from "../../../../components/core/Button/Button";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../Profile.styles";
import { colorGradient, colors } from "../../../../theme/colors";
import { pStyles } from "../ProfilePlayer.styled";
import {
  RESULT_CONFIG,
  TournamentResult,
} from "../../../../constants/tournament";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";
import { Ionicons } from "@expo/vector-icons";

export const CoachView = () => {
  const { user } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!user) return;

  return (
    <>
      {/* Statistiche da allenatore */}
      {user.coachStats && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Statistiche Allenatore</Text>
          </View>
          <View style={pStyles.statsCard}>
            <View style={pStyles.statsCardInner}>
              {/* Row 1: W/D/L */}
              <View style={pStyles.statsRow}>
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: colors.success }]}>
                    {user.coachStats.wins}
                  </Text>
                  <Text style={pStyles.statLabel}>Vittorie</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text
                    style={[pStyles.statNum, { color: colors.placeholder }]}
                  >
                    {user.coachStats.draws}
                  </Text>
                  <Text style={pStyles.statLabel}>Pareggi</Text>
                </View>
                <View style={pStyles.statDivider} />
                <View style={pStyles.statBubble}>
                  <Text style={[pStyles.statNum, { color: colors.danger }]}>
                    {user.coachStats.losses}
                  </Text>
                  <Text style={pStyles.statLabel}>Sconfitte</Text>
                </View>
              </View>
              {/* Row 2: tourneys + matches */}
              <View style={pStyles.statsTourneyRow}>
                <View style={pStyles.statTourney}>
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color={colors.primaryGradientMid}
                  />
                  <Text style={pStyles.statTourneyNum}>
                    {user.coachStats.tournamentsWon}
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
                    {user.coachStats.tournamentsPlayed}
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
                    {user.coachStats.matchesPlayed}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Partite totali</Text>
                </View>
              </View>
              {/* Row 3: cards */}
              <View
                style={[
                  pStyles.statsTourneyRow,
                  { borderTopWidth: 1, borderTopColor: colors.gray },
                ]}
              >
                <View style={pStyles.statTourney}>
                  <View style={pStyles.coachCardYellow} />
                  <Text style={pStyles.statTourneyNum}>
                    {user.coachStats.yellowCards}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Gialli</Text>
                </View>
                <View style={pStyles.statTourneyDivider} />
                <View style={pStyles.statTourney}>
                  <View style={pStyles.coachCardRed} />
                  <Text style={pStyles.statTourneyNum}>
                    {user.coachStats.redCards}
                  </Text>
                  <Text style={pStyles.statTourneyLabel}>Rossi</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {/* Storico tornei da allenatore */}
      {user.coachedTournaments && user.coachedTournaments.length > 0 && (
        <>
          <View style={styles.teamsHeader}>
            <Text style={styles.teamsTitle}>Storico tornei</Text>
          </View>
          {[...user.coachedTournaments]
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

      {/* Squadre allenate */}
      <>
        <View style={styles.teamsHeader}>
          <Text style={styles.teamsTitle}>Squadre allenate</Text>
          <ButtonLink
            text="Vedi tutte"
            handleBtn={() => navigation.navigate("Teams")}
            color={colors.primaryGradientMid}
            isColored
            isBold
          />
        </View>

        {!user.coachedTeams || user.coachedTeams.length === 0 ? (
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
            {user.coachedTeams.map((team) => (
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
