import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ts } from "./TeamSelect.styles";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  NavigationEnum,
  type RootStackParamList,
} from "../../types/navigation";
import type { Team } from "../../types/team";
import { useTeams } from "../../context/TeamsContext";
import {
  ButtonFullColored,
  ButtonGeneric,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { colorGradient, colors } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "TeamSelect">;

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <View style={[ts.radio, selected && ts.radioSelected]}>
      {selected && <View style={ts.radioDot} />}
    </View>
  );
}

function TeamCard({
  team,
  selected,
  onPress,
}: {
  team: Team;
  selected: boolean;
  onPress: () => void;
}) {
  const initials = team.name.slice(0, 2).toUpperCase();
  return (
    <ButtonGeneric
      style={[ts.teamCard, selected && ts.teamCardSelected]}
      handleBtn={onPress}
    >
      <LinearGradient colors={colorGradient} style={ts.teamAvatar}>
        <Text style={ts.teamAvatarText}>{initials}</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={ts.teamName} numberOfLines={1}>
          {team.name}
        </Text>
        <Text style={ts.teamMeta}>
          {team.sport} · {team.members.length} giocatori
        </Text>
      </View>
      <RadioCircle selected={selected} />
    </ButtonGeneric>
  );
}

export default function TeamSelect({ route, navigation }: Props) {
  const { tournamentId, entryFee, tournamentName } = route.params;
  const { teams, loading } = useTeams();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<number | null>(
    () => teams[0]?.id ?? null,
  );

  const selectedTeam = teams.find((t) => t.id === selectedId) ?? null;

  const handleContinue = () => {
    if (!selectedId || !selectedTeam) return;
    navigation.navigate(NavigationEnum.PAYMENT, {
      tournamentId,
      entryFee,
      tournamentName,
      teamId: selectedId,
      teamName: selectedTeam.name,
    });
  };

  return (
    <View style={ts.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={ts.header}>
          <ButtonIcon
            handleBtn={() => navigation.goBack()}
            style={ts.closeBtn}
            icon={<Ionicons name="close" size={22} color={colors.dark} />}
          />
          <Text style={ts.headerTitle}>Scegli la tua squadra</Text>
          <View style={{ width: 36 }} />
        </View>

        <Text style={ts.subtitle} numberOfLines={2}>
          {tournamentName}
        </Text>

        {/* Team list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={ts.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator
              color={colors.primaryGradientMid}
              style={{ marginTop: 32 }}
            />
          ) : teams.length === 0 ? (
            <View style={ts.emptyBox}>
              <Ionicons
                name="people-outline"
                size={48}
                color={colors.grayDark}
              />
              <Text style={ts.emptyText}>Nessuna squadra</Text>
              <Text style={ts.emptySubText}>
                Devi appartenere a una squadra per iscriverti al torneo.
              </Text>
              <ButtonFullColored
                text="Crea una squadra"
                handleBtn={() =>
                  navigation.navigate(NavigationEnum.CREATE_TEAM)
                }
              />
            </View>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                selected={selectedId === team.id}
                onPress={() => setSelectedId(team.id)}
              />
            ))
          )}
        </ScrollView>

        {/* Bottom bar */}
        <View style={[ts.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <ButtonFullColored
            iconRight={
              selectedTeam && (
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              )
            }
            text={
              selectedTeam
                ? `Continua con ${selectedTeam.name}`
                : "Seleziona una squadra"
            }
            handleBtn={handleContinue}
            isDisabled={!selectedId}
            isColored
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
