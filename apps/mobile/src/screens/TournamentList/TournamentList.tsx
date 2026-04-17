import React from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationEnum,
  type RootStackParamList,
} from "../../types/navigation";
import type { Tournament } from "../../types/tournament";
import { fetchTournaments } from "../../api/tournaments";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./TournamentList.styles";
import {
  ButtonFullColored,
  ButtonGeneric,
} from "../../components/core/Button/Button";
import { colors } from "../../theme/colors";
import { queryKeys } from "../../lib/queryKeys";

const STATUS_COLORS: Record<string, string> = {
  upcoming: colors.purpleBlue,
  ongoing: colors.success,
  completed: colors.placeholder,
};

function TournamentCard({
  tournament,
  onPress,
}: {
  tournament: Tournament;
  onPress: () => void;
}) {
  const date = new Date(tournament.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants;

  return (
    <ButtonGeneric style={styles.card} handleBtn={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.gameName}>{tournament.game}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[tournament.status] },
          ]}
        >
          <Text style={styles.statusText}>
            {tournament.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.tournamentName} numberOfLines={2}>
        {tournament.name}
      </Text>

      <View style={styles.cardDetails}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{date}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Spots left</Text>
          <Text style={styles.detailValue}>
            {tournament.status === "completed"
              ? "—"
              : spotsLeft === 0
                ? "Full"
                : spotsLeft}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Prize</Text>
          <Text style={[styles.detailValue, styles.prizeText]}>
            {tournament.prizePool}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Fee</Text>
          <Text style={styles.detailValue}>{tournament.entryFee}</Text>
        </View>
      </View>
    </ButtonGeneric>
  );
}

export default function TournamentListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const {
    data: tournaments = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.tournaments(),
    queryFn: fetchTournaments,
  });

  const handlePress = (tournament: Tournament) => {
    if (!user) {
      navigation.navigate(NavigationEnum.LOGIN, {
        redirect: "tournament",
        tournamentId: tournament.id,
      });
    } else {
      navigation.navigate(NavigationEnum.TOURNAMENT_DETAIL, {
        tournamentId: tournament.id,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.purpleBlue} />
        <Text style={styles.loadingText}>Loading tournaments…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : "Failed to load tournaments"}
        </Text>
        <ButtonFullColored
          text="Retry"
          handleBtn={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TournamentCard tournament={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.purpleBlue}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No tournaments available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
