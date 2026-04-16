import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import { tds } from "./TeamDetail.styles";
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
  type TeamMember,
  type TeamRole,
} from "../../types/navigation";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { colorGradient, colors } from "../../theme/colors";
import {
  ButtonBack,
  ButtonBorderColored,
  ButtonFullColored,
  ButtonGeneric,
  ButtonIcon,
  ButtonLink,
} from "../../components/Button/Button";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetail">;

const ROLE_LABEL: Record<string, string> = {
  representative: "Rappresentante",
  calciatore: "Calciatore",
  allenatore: "Allenatore",
  portiere: "Portiere",
};

const HAS_JERSEY: Record<string, boolean> = {
  representative: true,
  calciatore: true,
  portiere: true,
  allenatore: false,
};

function MemberRow({
  member,
  currentUserIsRep,
  onRemove,
  onChangeRole,
  onEditJersey,
}: {
  member: TeamMember;
  currentUserIsRep: boolean;
  onRemove: () => void;
  onChangeRole: () => void;
  onEditJersey: () => void;
}) {
  const initials = (member.firstName[0] ?? "") + (member.lastName[0] ?? "");
  const isRep = member.role === "representative";
  const showJersey = HAS_JERSEY[member.role] === true;

  return (
    <View style={[tds.memberRow, isRep && tds.memberRowRep]}>
      <View style={[tds.memberAvatar, isRep && tds.memberAvatarRep]}>
        {isRep ? (
          <LinearGradient colors={colorGradient} style={tds.memberAvatarInner}>
            <Text style={tds.memberAvatarText}>{initials.toUpperCase()}</Text>
          </LinearGradient>
        ) : (
          <View
            style={[tds.memberAvatarInner, { backgroundColor: colors.gray }]}
          >
            <Text style={[tds.memberAvatarText, { color: colors.placeholder }]}>
              {initials.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={tds.memberNameRow}>
          <Text style={tds.memberName}>
            {member.firstName} {member.lastName}
          </Text>
          {isRep && (
            <View style={tds.crownBadge}>
              <Ionicons
                name="star"
                size={10}
                color={colors.primaryGradientMid}
              />
              <Text style={tds.crownText}>Cap.</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          <Text style={tds.memberUsername}>@{member.username}</Text>
          {!isRep &&
            (currentUserIsRep ? (
              <ButtonBorderColored
                handleBtn={onChangeRole}
                iconRight={
                  <Ionicons
                    name="chevron-down"
                    size={10}
                    color={colors.placeholder}
                  />
                }
                text={ROLE_LABEL[member.role] ?? member.role}
              />
            ) : (
              <View style={tds.rolePillStatic}>
                <Text style={tds.rolePillText}>
                  {ROLE_LABEL[member.role] ?? member.role}
                </Text>
              </View>
            ))}
        </View>
      </View>
      {/* Jersey number — solo calciatore/portiere */}
      {showJersey && (
        <ButtonGeneric
          handleBtn={currentUserIsRep ? onEditJersey : () => {}}
          style={[tds.jerseyBadge, currentUserIsRep && tds.jerseyBadgeEditable]}
        >
          {member.jerseyNumber != null ? (
            <Text
              style={[
                tds.jerseyText,
                currentUserIsRep && tds.jerseyTextEditable,
              ]}
            >
              #{member.jerseyNumber}
            </Text>
          ) : (
            <Text style={tds.jerseyEmpty}>+</Text>
          )}
        </ButtonGeneric>
      )}
      {currentUserIsRep && !isRep ? (
        <ButtonIcon
          handleBtn={onRemove}
          icon={
            <Ionicons
              name="person-remove-outline"
              size={18}
              color={colors.primary}
            />
          }
        />
      ) : null}
    </View>
  );
}

export default function TeamDetail({ route, navigation }: Props) {
  const { teamId } = route.params;
  const {
    getTeamById,
    removeMember,
    sentPendingInvites,
    updateMemberRole,
    updateMemberJersey,
  } = useTeams() as any;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const team = getTeamById(teamId);
  const [confirmTarget, setConfirmTarget] = useState<TeamMember | null>(null);
  const [roleTarget, setRoleTarget] = useState<TeamMember | null>(null);
  const [jerseyTarget, setJerseyTarget] = useState<TeamMember | null>(null);
  const [jerseyInput, setJerseyInput] = useState("");

  const isRep =
    team?.members.find((m: TeamMember) => m.id === user?.id)?.role ===
    "representative";

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(teamId, memberId);
    } catch {
      console.error("Impossibile rimuovere il membro. Riprova.");
    }
  };

  const handleChangeRole = async (memberId: string, newRole: TeamRole) => {
    try {
      await updateMemberRole(teamId, memberId, newRole);
    } catch (e: any) {
      // Error is swallowed — the optimistic update will revert automatically
      console.error(e?.message);
    }
    setRoleTarget(null);
  };

  if (!team) {
    return (
      <SafeAreaView style={tds.root} edges={["top"]}>
        <View style={tds.centerBox}>
          <Text style={{ color: colors.danger }}>Squadra non trovata</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = team.name.slice(0, 2).toUpperCase();
  const sortedMembers = [...team.members].sort(
    (a: TeamMember, b: TeamMember) =>
      a.role === "representative" ? -1 : b.role === "representative" ? 1 : 0,
  );

  return (
    <View style={tds.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header gradient */}
        <LinearGradient colors={colorGradient} style={tds.header}>
          <SafeAreaView edges={["top"]}>
            <View style={tds.headerTop}>
              <ButtonBack handleBtn={() => navigation.goBack()} />
            </View>
            <View style={tds.headerBody}>
              <View style={tds.teamAvatarLarge}>
                <Text style={tds.teamAvatarLargeText}>{initials}</Text>
              </View>
              <Text style={tds.teamName}>{team.name}</Text>
              <View style={tds.sportChip}>
                <Ionicons
                  name="shield-checkmark"
                  size={12}
                  color={colors.white}
                />
                <Text style={tds.sportChipText}>{team.sport}</Text>
              </View>
              <Text style={tds.membersCount}>
                {team.members.length} giocatori
              </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Members list */}
        <View style={tds.section}>
          <Text style={tds.sectionTitle}>Giocatori</Text>
          {sortedMembers.map((m: TeamMember) => (
            <MemberRow
              key={m.id}
              member={m}
              currentUserIsRep={isRep}
              onRemove={() => setConfirmTarget(m)}
              onChangeRole={() => setRoleTarget(m)}
              onEditJersey={() => {
                setJerseyTarget(m);
                setJerseyInput(
                  m.jerseyNumber != null ? String(m.jerseyNumber) : "",
                );
              }}
            />
          ))}
        </View>

        {/* Pending sent invites — only visible to representative */}
        {isRep &&
          (() => {
            const sentForThisTeam = (sentPendingInvites as any[]).filter(
              (i: any) => i.teamId === teamId,
            );
            if (sentForThisTeam.length === 0) return null;
            return (
              <View style={[tds.section, { marginTop: 12 }]}>
                <Text style={tds.sectionTitle}>INVITI IN ATTESA</Text>
                {sentForThisTeam.map((invite: any) => (
                  <View key={invite.id} style={tds.pendingInviteRow}>
                    <View style={tds.pendingInviteAvatar}>
                      <Text style={tds.pendingInviteAvatarText}>?</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={tds.pendingInviteName}>Invito inviato</Text>
                      <Text style={tds.pendingInviteSub}>
                        In attesa di conferma
                      </Text>
                    </View>
                    <View style={tds.pendingBadge}>
                      <Text style={tds.pendingBadgeText}>In attesa</Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })()}

        {/* Invite button — only visible to the representative */}
        {isRep && (
          <View style={{ paddingHorizontal: 15, paddingTop: 10 }}>
            <ButtonFullColored
              text="Invita giocatori"
              iconLeft={
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={colors.white}
                />
              }
              handleBtn={() =>
                navigation.navigate(NavigationEnum.INVITE_PLAYERS, {
                  teamId: team.id,
                })
              }
              isColored
            />
          </View>
        )}
      </ScrollView>

      {/* Remove member confirmation modal */}
      <Modal
        visible={confirmTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmTarget(null)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            {/* Avatar */}
            <View style={tds.modalAvatar}>
              <Text style={tds.modalAvatarText}>
                {confirmTarget
                  ? (confirmTarget.firstName[0] ?? "") +
                    (confirmTarget.lastName[0] ?? "")
                  : ""}
              </Text>
            </View>
            <Text style={tds.modalTitle}>Rimuovi giocatore</Text>
            <Text style={tds.modalBody}>
              Vuoi rimuovere{"\n"}
              <Text style={tds.modalMemberName}>
                {confirmTarget?.firstName} {confirmTarget?.lastName}
              </Text>
              {"\n"}dalla squadra?
            </Text>
            <Text style={tds.modalWarning}>
              Questa azione non può essere annullata.
            </Text>
            <View style={tds.modalActions}>
              <ButtonLink
                style={tds.modalCancelBtn}
                text="Annulla"
                handleBtn={() => setConfirmTarget(null)}
              />
              <ButtonLink
                style={tds.modalRemoveBtn}
                text="Rimuovi"
                handleBtn={() => {
                  if (confirmTarget) {
                    handleRemoveMember(confirmTarget.id);
                    setConfirmTarget(null);
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Role picker modal */}
      <Modal
        visible={roleTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setRoleTarget(null)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <Text style={tds.modalTitle}>Cambia ruolo</Text>
            <Text style={[tds.modalBody, { marginBottom: 20 }]}>
              {roleTarget?.firstName} {roleTarget?.lastName}
            </Text>
            {(["calciatore", "portiere", "allenatore"] as TeamRole[]).map(
              (role) => {
                if (role === "representative") return null;
                const isCurrent = roleTarget?.role === role;
                const isOccupied =
                  !isCurrent &&
                  (role === "allenatore" || role === "portiere") &&
                  team?.members.some(
                    (m: TeamMember) =>
                      m.role === role && m.id !== roleTarget?.id,
                  );
                return (
                  <ButtonGeneric
                    key={role}
                    style={[
                      tds.roleOption,
                      isCurrent && tds.roleOptionCurrent,
                      isOccupied && tds.roleOptionDisabled,
                    ]}
                    handleBtn={() => {
                      if (!isOccupied && roleTarget)
                        handleChangeRole(roleTarget.id, role);
                    }}
                  >
                    <Text
                      style={[
                        tds.roleOptionText,
                        isCurrent && tds.roleOptionTextCurrent,
                        isOccupied && tds.roleOptionTextDisabled,
                      ]}
                    >
                      {ROLE_LABEL[role]}
                      {isOccupied ? " (già presente)" : ""}
                    </Text>
                    {isCurrent && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primaryGradientMid}
                      />
                    )}
                  </ButtonGeneric>
                );
              },
            )}
            <ButtonLink
              style={[tds.modalCancelBtn, { marginTop: 8, width: "100%" }]}
              text="Annulla"
              handleBtn={() => setRoleTarget(null)}
            />
          </View>
        </View>
      </Modal>

      {/* Jersey number edit modal */}
      <Modal
        visible={jerseyTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setJerseyTarget(null)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <Text style={tds.modalTitle}>Numero di maglia</Text>
            <Text style={[tds.modalBody, { marginBottom: 16 }]}>
              {jerseyTarget?.firstName} {jerseyTarget?.lastName}
            </Text>
            <TextInput
              style={{
                width: "100%",
                borderWidth: 1.5,
                borderColor: colors.primarySelectedBg,
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 16,
                fontSize: 28,
                fontWeight: "800",
                color: colors.dark,
                textAlign: "center",
                marginBottom: 20,
              }}
              value={jerseyInput}
              onChangeText={(v) => {
                const clean = v.replace(/[^0-9]/g, "").slice(0, 2);
                setJerseyInput(clean);
              }}
              keyboardType="number-pad"
              placeholder="—"
              placeholderTextColor={colors.grayDark}
              maxLength={2}
              autoFocus
            />
            <View style={tds.modalActions}>
              <ButtonLink
                style={tds.modalCancelBtn}
                text="Annulla"
                handleBtn={() => setJerseyTarget(null)}
              />
              <ButtonLink
                style={[
                  tds.modalRemoveBtn,
                  { backgroundColor: colors.primary },
                ]}
                text="Salva"
                handleBtn={() => {
                  if (!jerseyTarget) return;
                  const num = parseInt(jerseyInput, 10);
                  const valid = !isNaN(num) && num >= 1 && num <= 99;
                  updateMemberJersey(
                    teamId,
                    jerseyTarget.id,
                    valid ? num : undefined,
                  );
                  setJerseyTarget(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
