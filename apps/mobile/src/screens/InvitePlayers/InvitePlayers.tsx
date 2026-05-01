import React, { useState } from "react";
import { View, Text, StatusBar, ScrollView, Share, Alert } from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import { RootStackParamList } from "../../types/navigation";
import { ip } from "./InvitePlayers.styles";
import { searchUsers } from "../../api/teams";
import {
  ButtonBack,
  ButtonFullColored,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { TabBar } from "../../components/core/TabBar/TabBar";
import { colors } from "../../theme/colors";
import { InputBoxSearch } from "../../components/core/InputBoxSearch/InputBoxSearch";
import { AppUser, Team } from "../../types/team";

type Props = NativeStackScreenProps<RootStackParamList, "InvitePlayers">;
type Tab = "cerca" | "condividi";

interface UseRowProps {
  user: AppUser;
  alreadyMember: boolean;
  invited: boolean;
  onInvite: () => void;
}

function UserRow({ user, alreadyMember, invited, onInvite }: UseRowProps) {
  const initials =
    (user.firstName ? user.firstName[0] : "") +
    (user.lastName ? user.lastName[0] : "");
  return (
    <View style={ip.userRow}>
      <View style={ip.userAvatar}>
        <Text style={ip.userAvatarText}>{initials.toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ip.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={ip.userUsername}>@{user.username}</Text>
      </View>
      {alreadyMember ? (
        <View style={ip.alreadyBadge}>
          <Text style={ip.alreadyBadgeText}>Già membro</Text>
        </View>
      ) : invited ? (
        <View style={ip.invitedBadge}>
          <Ionicons name="checkmark" size={14} color={colors.success} />
          <Text style={ip.invitedBadgeText}>In attesa</Text>
        </View>
      ) : (
        <ButtonFullColored
          text="Invita"
          handleBtn={onInvite}
          isColored
          size={sizesEnum.small}
        />
      )}
    </View>
  );
}

export default function InvitePlayers({ route, navigation }: Props) {
  const { teamId } = route.params;
  const { getTeamById, addMember, sentPendingInvites } = useTeams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const insets = useSafeAreaInsets();

  const [tab, setTab] = useState<Tab>("cerca");
  const [localQuery, setLocalQuery] = useState("");
  const [invited, setInvited] = useState<Set<number>>(new Set());

  const team: Team | undefined = getTeamById(teamId);
  const memberIds = new Set(team?.members.map((m) => m.id) ?? []);

  const pendingInviteUserIds = new Set(
    sentPendingInvites
      .filter((i) => i.teamId === teamId)
      .map((i) => i.toUserId),
  );

  const isRep =
    team?.members.find((m) => m.id === user?.id)?.role === "representative";

  const handleInvite = async (appUser: AppUser) => {
    try {
      await addMember(teamId, appUser);
      setInvited((prev) => new Set(prev).add(appUser.id));
      addNotification({
        title: "Invito inviato",
        body: `Hai invitato ${appUser.firstName} ${appUser.lastName} nella squadra ${team?.name ?? ""}. In attesa di conferma.`,
        timestamp: new Date().toISOString(),
      });
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Sei stato invitato!",
          body: `${user?.first_name ?? ""} ${user?.last_name ?? ""} ti ha invitato nella squadra "${team?.name ?? ""}". Vai nelle squadre per accettare.`,
          data: { screen: "Teams" },
        },
        trigger: null,
      }).catch(() => {});
    } catch {
      Alert.alert("Errore", "Impossibile invitare l'utente. Riprova.");
    }
  };

  const inviteLink = `competo://teams/join/${teamId}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Unisciti alla mia squadra su Competo! ${inviteLink}`,
        title: `Entra in ${team?.name ?? "una squadra"}`,
      });
    } catch {
      // user cancelled
    }
  };

  if (!isRep) {
    return (
      <View style={ip.root}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={ip.header}>
            <ButtonIcon
              handleBtn={() => navigation.goBack()}
              style={ip.backBtn}
              icon={
                <Ionicons name="chevron-back" size={24} color={colors.dark} />
              }
            />
            <Text style={ip.headerTitle}>Invita giocatori</Text>
            <View style={{ width: 36 }} />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <Ionicons
              name="lock-closed-outline"
              size={48}
              color={colors.grayDark}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.placeholder,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              Solo il rappresentante può invitare giocatori
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={ip.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={ip.header}>
          <ButtonBack
            handleBtn={() => navigation.goBack()}
            isArrowBack={false}
          />
          <Text style={ip.headerTitle}>Invita giocatori</Text>
          <View style={{ width: 36 }} />
        </View>
        {team && <Text style={ip.teamName}>{team.name}</Text>}

        {/* Tab bar */}
        <TabBar
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "cerca", label: "Cerca", icon: "search" },
            {
              key: "condividi",
              label: "Condividi link",
              icon: "share-social",
            },
          ]}
        />

        {tab === "cerca" ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              ip.cercaContainer,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <InputBoxSearch<AppUser>
              placeholder="Cerca per nome o username..."
              onSearch={(q) => searchUsers(q, user?.token ?? "")}
              onQueryChange={setLocalQuery}
              emptyMessage={
                localQuery.trim()
                  ? `Nessun utente trovato per "${localQuery}"`
                  : undefined
              }
              renderResult={(u, _i, _onPress) => (
                <UserRow
                  key={u.id}
                  user={u}
                  alreadyMember={memberIds.has(u.id)}
                  invited={invited.has(u.id) || pendingInviteUserIds.has(u.id)}
                  onInvite={() => handleInvite(u)}
                />
              )}
            />
            {localQuery.trim().length === 0 && (
              <View style={ip.hintBox}>
                <Ionicons
                  name="people-outline"
                  size={40}
                  color={colors.disabled}
                />
                <Text style={ip.hintText}>
                  Cerca un giocatore per nome o username per invitarlo alla tua
                  squadra.
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          /* Share link tab */
          <View style={ip.shareTab}>
            <View style={ip.shareIllustration}>
              <Ionicons
                name="link"
                size={36}
                color={colors.primaryGradientMid}
              />
            </View>
            <Text style={ip.shareTitle}>Condividi il link di invito</Text>
            <Text style={ip.shareSub}>
              Chiunque clicchi questo link potrà unirsi alla squadra{" "}
              {team?.name}.
            </Text>

            <View style={ip.linkBox}>
              <Text style={ip.linkText} numberOfLines={1}>
                {inviteLink}
              </Text>
            </View>

            <ButtonFullColored
              iconRight={
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={colors.white}
                />
              }
              text="Condividi"
              handleBtn={handleShare}
              isColored
            />

            <View style={ip.socialRow}>
              {(
                ["logo-whatsapp", "logo-instagram", "mail-outline"] as const
              ).map((icon) => {
                const theIcon = (
                  <Ionicons name={icon} size={22} color={colors.placeholder} />
                );
                return (
                  <ButtonIcon
                    key={icon}
                    style={ip.socialBtn}
                    handleBtn={handleShare}
                    icon={theIcon}
                  />
                );
              })}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
