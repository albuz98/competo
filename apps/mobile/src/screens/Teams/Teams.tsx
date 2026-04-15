import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { tss } from "./Teams.styles";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  type RootStackParamList,
  type Team,
  type PendingInvite,
  NavigationEnum,
} from "../../types";
import { useTeams } from "../../context/TeamsContext";
import {
  ButtonAccept,
  ButtonFullColored,
  ButtonGeneric,
  ButtonGradient,
  ButtonIcon,
  ButtonReject,
} from "../../components/Button/Button";
import { colorGradient, colors } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Teams">;

function TeamCard({ team, onPress }: { team: Team; onPress: () => void }) {
  const initials = team.name.slice(0, 2).toUpperCase();
  const representative = team.members.find((m) => m.role === "representative");
  return (
    <ButtonGeneric style={tss.teamCard} handleBtn={onPress}>
      <LinearGradient colors={colorGradient} style={tss.teamAvatar}>
        <Text style={tss.teamAvatarText}>{initials}</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={tss.teamName} numberOfLines={1}>
          {team.name}
        </Text>
        <Text style={tss.teamMeta}>
          {team.sport} · {team.members.length} giocatori
        </Text>
        {representative && (
          <Text style={tss.teamRep} numberOfLines={1}>
            Cap. {representative.firstName} {representative.lastName}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.grayDark} />
    </ButtonGeneric>
  );
}

function InviteCard({
  invite,
  onAccept,
  onReject,
}: {
  invite: PendingInvite;
  onAccept: () => void;
  onReject: () => void;
}) {
  const initials = invite.teamName.slice(0, 2).toUpperCase();
  return (
    <View style={tss.inviteCard}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <LinearGradient colors={colorGradient} style={tss.inviteCardAvatar}>
          <Text style={tss.inviteCardAvatarText}>{initials}</Text>
        </LinearGradient>
        <View style={tss.inviteCardInfo}>
          <Text style={tss.inviteTeamName}>{invite.teamName}</Text>
          <Text style={tss.inviteCardFrom}>{invite.sport}</Text>
          <Text style={tss.inviteCardFrom}>
            Invitato da {invite.fromFirstName} {invite.fromLastName}
          </Text>
        </View>
      </View>
      <View style={tss.inviteCardActions}>
        <ButtonAccept text="Accetta" handleBtn={onAccept} />
        <ButtonReject text="Rifiuta" handleBtn={onReject} />
      </View>
    </View>
  );
}

export default function TeamsScreen({ navigation }: Props) {
  const { teams, loading, pendingReceivedInvites, acceptInvite, rejectInvite } =
    useTeams();
  const insets = useSafeAreaInsets();

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
    } catch {
      Alert.alert("Errore", "Impossibile accettare l'invito. Riprova.");
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId);
    } catch {
      Alert.alert("Errore", "Impossibile rifiutare l'invito. Riprova.");
    }
  };

  return (
    <View style={tss.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={tss.header}>
          <ButtonIcon
            handleBtn={() => navigation.goBack()}
            style={tss.backBtn}
            icon={
              <Ionicons name="chevron-back" size={24} color={colors.dark} />
            }
          />
          <Text style={tss.headerTitle}>Le mie squadre</Text>
          <ButtonGradient
            style={tss.addBtn}
            handleBtn={() => navigation.navigate(NavigationEnum.CREATE_TEAM)}
          >
            <Ionicons name="add" size={20} color={colors.white} />
          </ButtonGradient>
        </View>

        {loading ? (
          <View style={tss.centerBox}>
            <ActivityIndicator color={colors.primaryGradientMid} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              tss.scrollContent,
              { paddingBottom: insets.bottom + 20 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Pending received invites section */}
            {pendingReceivedInvites.length > 0 && (
              <View style={tss.invitesSection}>
                <Text style={tss.invitesSectionTitle}>INVITI IN SOSPESO</Text>
                {pendingReceivedInvites.map((invite) => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={() => handleAcceptInvite(invite.id)}
                    onReject={() => handleRejectInvite(invite.id)}
                  />
                ))}
              </View>
            )}

            {teams.length === 0 && pendingReceivedInvites.length === 0 ? (
              <View style={tss.emptyBox}>
                <View style={tss.emptyIcon}>
                  <Ionicons
                    name="people-outline"
                    size={48}
                    color={colors.grayDark}
                  />
                </View>
                <Text style={tss.emptyTitle}>Nessuna squadra</Text>
                <Text style={tss.emptySub}>
                  Crea la tua prima squadra e invita i tuoi amici a giocare
                  insieme.
                </Text>
                <ButtonFullColored
                  text="Crea squadra"
                  handleBtn={() =>
                    navigation.navigate(NavigationEnum.CREATE_TEAM)
                  }
                />
              </View>
            ) : (
              teams.map((t) => (
                <TeamCard
                  key={t.id}
                  team={t}
                  onPress={() =>
                    navigation.navigate(NavigationEnum.TEAM_DETAIL, {
                      teamId: t.id,
                    })
                  }
                />
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
