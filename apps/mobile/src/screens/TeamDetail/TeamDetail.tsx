import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
} from "../../types/navigation";
import type { TeamMember } from "../../types/team";
import { TeamRole } from "../../constants/team";
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
} from "../../components/core/Button/Button";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetail">;

const ROLE_LABEL: Record<string, string> = {
  [TeamRole.REPRESENTATIVE]: "Rappresentante",
  [TeamRole.PLAYER]: "Calciatore",
  [TeamRole.COACH]: "Allenatore",
  [TeamRole.GOLKEEPER]: "Portiere",
};

const HAS_JERSEY: Record<string, boolean> = {
  [TeamRole.REPRESENTATIVE]: true,
  [TeamRole.PLAYER]: true,
  [TeamRole.GOLKEEPER]: true,
  [TeamRole.COACH]: false,
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
  const initials =
    (member.firstName ? member.firstName[0] : "") +
    (member.lastName ? member.lastName[0] : "");
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
    sentPendingInvites,
    updateMemberRole,
    updateMemberJersey,
    deleteTeam,
    leaveTeam,
    updateTeam,
  } = useTeams() as any;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const team = getTeamById(teamId);
  const [confirmTarget, setConfirmTarget] = useState<TeamMember | null>(null);
  const [roleTarget, setRoleTarget] = useState<TeamMember | null>(null);
  const [jerseyTarget, setJerseyTarget] = useState<TeamMember | null>(null);
  const [jerseyInput, setJerseyInput] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editTeamVisible, setEditTeamVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLogoUri, setEditLogoUri] = useState<string | undefined>(undefined);

  const isRep =
    team?.members.find((m: TeamMember) => m.id === user?.id)?.role ===
    "representative";

  const handleRemoveMember = async (memberId: number) => {
    try {
      await leaveTeam(teamId, memberId);
    } catch {
      console.error("Impossibile rimuovere il membro. Riprova.");
    }
  };

  const handleChangeRole = async (memberId: number, newRole: TeamRole) => {
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
              <ButtonIcon
                handleBtn={() => setMenuVisible(true)}
                icon={
                  <Ionicons
                    name="ellipsis-vertical"
                    size={22}
                    color={colors.white}
                  />
                }
              />
            </View>
            <View style={tds.headerBody}>
              <View style={tds.teamAvatarLarge}>
                {team.logoUrl ? (
                  <Image
                    source={{ uri: team.logoUrl }}
                    style={tds.teamAvatarImage}
                  />
                ) : (
                  <Text style={tds.teamAvatarLargeText}>{initials}</Text>
                )}
              </View>
              <Text style={tds.teamName}>{team.name}</Text>
              <View style={tds.sportChip}>
                <Ionicons name="football" size={12} color={colors.white} />
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
                  ? (confirmTarget.firstName
                      ? confirmTarget.firstName[0]
                      : "") +
                    (confirmTarget.lastName ? confirmTarget.lastName[0] : "")
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
            {[TeamRole.PLAYER, TeamRole.GOLKEEPER, TeamRole.COACH].map(
              (role) => {
                if (role === TeamRole.REPRESENTATIVE) return null;
                const isCurrent = roleTarget?.role === role;
                const isOccupied =
                  !isCurrent &&
                  (role === TeamRole.COACH || role === TeamRole.GOLKEEPER) &&
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

      {/* Three-dot dropdown menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={tds.menuOverlay}>
          <ButtonGeneric
            style={{ flex: 1 }}
            handleBtn={() => setMenuVisible(false)}
          >
            <View />
          </ButtonGeneric>
          <View style={[tds.menuCard, { top: insets.top + 52, right: 16 }]}>
            {isRep && (
              <ButtonGeneric
                style={tds.menuItem}
                handleBtn={() => {
                  setMenuVisible(false);
                  setEditName(team.name);
                  setEditLogoUri(team.logoUrl);
                  setEditTeamVisible(true);
                }}
              >
                <Ionicons name="pencil-outline" size={18} color={colors.dark} />
                <Text style={tds.menuItemText}>Modifica squadra</Text>
              </ButtonGeneric>
            )}
            {isRep ? (
              <ButtonGeneric
                style={[tds.menuItem, tds.menuItemDanger]}
                handleBtn={() => {
                  setMenuVisible(false);
                  setConfirmDelete(true);
                }}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={[tds.menuItemText, { color: colors.danger }]}>
                  Elimina squadra
                </Text>
              </ButtonGeneric>
            ) : (
              <ButtonGeneric
                style={tds.menuItem}
                handleBtn={() => {
                  setMenuVisible(false);
                  setConfirmLeave(true);
                }}
              >
                <Ionicons name="exit-outline" size={18} color={colors.danger} />
                <Text style={[tds.menuItemText, { color: colors.danger }]}>
                  Lascia squadra
                </Text>
              </ButtonGeneric>
            )}
          </View>
        </View>
      </Modal>

      {/* Leave team confirmation modal */}
      <Modal
        visible={confirmLeave}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmLeave(false)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <View style={tds.modalAvatar}>
              <Ionicons name="exit-outline" size={28} color={colors.danger} />
            </View>
            <Text style={tds.modalTitle}>Lascia squadra</Text>
            <Text style={tds.modalBody}>
              Sei sicuro di voler lasciare{"\n"}
              <Text style={tds.modalMemberName}>{team.name}</Text>?
            </Text>
            <Text style={tds.modalWarning}>
              Questa azione non può essere annullata.
            </Text>
            <View style={tds.modalActions}>
              <ButtonLink
                style={tds.modalCancelBtn}
                text="Annulla"
                handleBtn={() => setConfirmLeave(false)}
              />
              <ButtonLink
                style={tds.modalRemoveBtn}
                text="Lascia"
                handleBtn={async () => {
                  setConfirmLeave(false);
                  await leaveTeam(teamId);
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete team confirmation modal */}
      <Modal
        visible={confirmDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDelete(false)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <View style={tds.modalAvatar}>
              <Ionicons name="trash-outline" size={28} color={colors.danger} />
            </View>
            <Text style={tds.modalTitle}>Elimina squadra</Text>
            <Text style={tds.modalBody}>
              Sei sicuro di voler eliminare{"\n"}
              <Text style={tds.modalMemberName}>{team.name}</Text>?
            </Text>
            <Text style={tds.modalWarning}>
              Tutti i membri verranno rimossi. Questa azione non può essere
              annullata.
            </Text>
            <View style={tds.modalActions}>
              <ButtonLink
                style={tds.modalCancelBtn}
                text="Annulla"
                handleBtn={() => setConfirmDelete(false)}
              />
              <ButtonLink
                style={tds.modalRemoveBtn}
                text="Elimina"
                handleBtn={async () => {
                  setConfirmDelete(false);
                  try {
                    await deleteTeam(teamId);
                  } catch {
                    // optimistic update already reverted by mutation
                  }
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit team modal */}
      <Modal
        visible={editTeamVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditTeamVisible(false)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <Text style={tds.modalTitle}>Modifica squadra</Text>

            {/* Logo preview + pick button */}
            <TouchableOpacity
              style={tds.logoPickerContainer}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ["images"],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets.length > 0) {
                  setEditLogoUri(result.assets[0].uri);
                }
              }}
            >
              {editLogoUri ? (
                <Image
                  source={{ uri: editLogoUri }}
                  style={tds.logoPickerImage}
                />
              ) : (
                <View style={tds.logoPickerPlaceholder}>
                  <Text style={tds.logoPickerInitials}>
                    {editName.slice(0, 2).toUpperCase() || initials}
                  </Text>
                </View>
              )}
              <View style={tds.logoPickerBadge}>
                <Ionicons name="camera" size={14} color={colors.white} />
              </View>
            </TouchableOpacity>

            {editLogoUri ? (
              <ButtonLink
                style={{ marginBottom: 16 }}
                text="Rimuovi logo"
                handleBtn={() => setEditLogoUri(undefined)}
              />
            ) : null}

            {/* Name input */}
            <TextInput
              style={tds.editNameInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome squadra"
              placeholderTextColor={colors.grayDark}
              maxLength={40}
              autoCorrect={false}
            />

            <View style={tds.modalActions}>
              <ButtonLink
                style={tds.modalCancelBtn}
                text="Annulla"
                handleBtn={() => setEditTeamVisible(false)}
              />
              <ButtonLink
                style={[
                  tds.modalRemoveBtn,
                  { backgroundColor: colors.primary },
                ]}
                text="Salva"
                handleBtn={async () => {
                  const trimmed = editName.trim();
                  if (!trimmed) return;
                  setEditTeamVisible(false);
                  try {
                    await updateTeam(teamId, {
                      name: trimmed,
                      logoUrl: editLogoUri,
                    });
                  } catch {
                    // optimistic update reverts on error
                  }
                }}
              />
            </View>
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
