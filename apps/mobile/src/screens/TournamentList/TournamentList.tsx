import React, { useEffect, useState, useCallback } from "react";
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
import {
  NavigationEnum,
  type RootStackParamList,
  type Tournament,
} from "../../types";
import { fetchTournaments } from "../../api/tournaments";
import { useAuth } from "../../context/AuthContext";
import { styles } from "./TournamentList.styles";
import {
  ButtonFullColored,
  ButtonGeneric,
} from "../../components/Button/Button";
import { colors } from "../../theme/colors";

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
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTournaments();
      setTournaments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tournaments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  if (loading) {
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
        <Text style={styles.errorText}>{error}</Text>
        <ButtonFullColored
          text="Retry"
          handleBtn={() => {
            setLoading(true);
            load();
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
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
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
