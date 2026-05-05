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
  ActivityIndicator,
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
import { ROLE_LABEL, type TeamMemberResponse } from "../../types/team";
import { TeamRole } from "../../constants/team";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { colorGradient, colors } from "../../theme/colors";
import {
  ButtonBack,
  ButtonFullColored,
  ButtonGeneric,
  ButtonIcon,
  ButtonLink,
} from "../../components/core/Button/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTeamDetail, fetchTeamMembers } from "../../api/teams";
import { queryKeys } from "../../lib/queryKeys";
import { MemberRow } from "../../components/MemberRow/MemberRow";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetail">;

export default function TeamDetail({ route, navigation }: Props) {
  const { teamId } = route.params;
  const {
    sentPendingInvites,
    updateMemberRole,
    deleteTeam,
    leaveTeam,
    updateTeam,
  } = useTeams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();

  const {
    data: teamDetail,
    isLoading: loadingDetail,
    error: detailError,
  } = useQuery({
    queryKey: queryKeys.teamDetail(teamId),
    queryFn: () => fetchTeamDetail(teamId, user!.token),
    enabled: !!user,
  });

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: queryKeys.teamMembers(teamId),
    queryFn: () => fetchTeamMembers(teamId, user!.token),
    enabled: !!user,
  });

  const [confirmTarget, setConfirmTarget] = useState<TeamMemberResponse | null>(
    null,
  );
  const [roleTarget, setRoleTarget] = useState<TeamMemberResponse | null>(null);
  const [jerseyTarget, setJerseyTarget] = useState<TeamMemberResponse | null>(
    null,
  );
  const [jerseyInput, setJerseyInput] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editTeamVisible, setEditTeamVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLogoUri, setEditLogoUri] = useState<string | undefined>(undefined);

  const isRep =
    members.find((m: TeamMemberResponse) => m.user_id === user?.id)?.role ===
    "representative";

  const handleRemoveMember = async (userId: number) => {
    try {
      await leaveTeam(teamId, userId);
      qc.invalidateQueries({ queryKey: queryKeys.teamMembers(teamId) });
    } catch {
      console.error("Impossibile rimuovere il membro. Riprova.");
    }
  };

  const handleChangeRole = async (userId: number, newRole: TeamRole) => {
    try {
      await updateMemberRole(teamId, userId, newRole);
      qc.invalidateQueries({ queryKey: queryKeys.teamMembers(teamId) });
    } catch (e: any) {
      console.error(e?.message);
    }
    setRoleTarget(null);
  };

  if (loadingDetail || loadingMembers) {
    return (
      <SafeAreaView style={tds.root} edges={["top"]}>
        <View style={tds.centerBox}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!teamDetail || detailError) {
    return (
      <SafeAreaView style={tds.root} edges={["top"]}>
        <View style={tds.centerBox}>
          <Text style={{ color: colors.danger }}>Squadra non trovata</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = teamDetail.name.slice(0, 2).toUpperCase();
  const sortedMembers = [...members].sort(
    (a: TeamMemberResponse, b: TeamMemberResponse) =>
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
                {teamDetail.logo_url ? (
                  <Image
                    source={{ uri: teamDetail.logo_url }}
                    style={tds.teamAvatarImage}
                  />
                ) : (
                  <Text style={tds.teamAvatarLargeText}>{initials}</Text>
                )}
              </View>
              <Text style={tds.teamName}>{teamDetail.name}</Text>
              <View style={tds.sportChip}>
                <Ionicons name="football" size={12} color={colors.white} />
                <Text style={tds.sportChipText}>{teamDetail.sport}</Text>
              </View>
              <Text style={tds.membersCount}>{members.length} giocatori</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Members list */}
        <View style={tds.section}>
          <Text style={tds.sectionTitle}>Giocatori</Text>
          {sortedMembers.map((m: TeamMemberResponse) => (
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
                  teamId: teamDetail.id,
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
                    handleRemoveMember(confirmTarget.user_id);
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
                  members.some(
                    (m: TeamMemberResponse) =>
                      m.role === role && m.user_id !== roleTarget?.user_id,
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
                        handleChangeRole(roleTarget.user_id, role);
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
                  setEditName(teamDetail.name);
                  setEditLogoUri(teamDetail.logo_url || undefined);
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
              <Text style={tds.modalMemberName}>{teamDetail.name}</Text>?
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
              <Text style={tds.modalMemberName}>{teamDetail.name}</Text>?
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
                    qc.invalidateQueries({
                      queryKey: queryKeys.teamDetail(teamId),
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
                  qc.setQueryData<TeamMemberResponse[]>(
                    queryKeys.teamMembers(teamId),
                    (old = []) =>
                      old.map((m) =>
                        m.user_id === jerseyTarget.user_id
                          ? { ...m, jerseyNumber: valid ? num : undefined }
                          : m,
                      ),
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
