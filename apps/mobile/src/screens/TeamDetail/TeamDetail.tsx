import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ModalCenter } from "../../components/core/ModalCenter/ModalCenter";
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
import { ROLE_LABEL, TeamTab, type TeamMemberResponse } from "../../types/team";
import { TeamRole } from "../../constants/team";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { colorGradient, colors } from "../../theme/colors";
import {
  ButtonBack,
  ButtonGeneric,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTeamDetail, fetchTeamMembers } from "../../api/teams";
import { queryKeys } from "../../lib/queryKeys";
import { Members } from "./SubComponents/Members";
import { GAMES } from "../../constants/generals";
import { Tab } from "../../types/general";
import { TabSwitcher } from "../../components/core/TabSwitcher/TabSwitcher";
import { Stats } from "./SubComponents/Stats";
import { ClassificationGoleador } from "./SubComponents/ClassificationGoleador";
import { Tournaments } from "./SubComponents/Tournaments";

type Props = NativeStackScreenProps<
  RootStackParamList,
  NavigationEnum.TEAM_DETAIL
>;

const TABS: Tab[] = [
  { key: TeamTab.MEMBER, label: "Membri" },
  { key: TeamTab.STATS, label: "Statistiche" },
  { key: TeamTab.CLASSIFICATION_GOLEADOR, label: "Marcatori" },
  { key: TeamTab.TOURNAMENTS, label: "Tornei" },
];

export default function TeamDetail({ route, navigation }: Props) {
  const { teamId } = route.params;
  const { updateMemberRole, deleteTeam, leaveTeam, updateTeam } = useTeams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TeamTab>(TeamTab.MEMBER);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLogoUri, setEditLogoUri] = useState<string | undefined>(undefined);
  const [editSport, setEditSport] = useState("");
  const editInitialName = useRef("");
  const editInitialLogo = useRef<string | undefined>(undefined);
  const editInitialSport = useRef("");

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

  const isRep = user?.id != null && user.id === teamDetail?.representative_id;

  const [sportPickerVisible, setSportPickerVisible] = useState(false);
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

  const isDirty =
    editName !== editInitialName.current ||
    editLogoUri !== editInitialLogo.current ||
    editSport !== editInitialSport.current;

  const enterEditMode = () => {
    if (!teamDetail) return;
    editInitialName.current = teamDetail.name;
    editInitialLogo.current = teamDetail.logo_url || undefined;
    editInitialSport.current = teamDetail.sport;
    setEditName(teamDetail.name);
    setEditLogoUri(teamDetail.logo_url || undefined);
    setEditSport(teamDetail.sport);
    setEditMode(true);
    setMenuVisible(false);
  };

  const exitEditMode = () => setEditMode(false);

  const handleBackPress = () => {
    if (editMode) {
      if (isDirty) {
        Alert.alert(
          "Modifiche non salvate",
          "Hai delle modifiche non salvate. Vuoi uscire senza salvare?",
          [
            { text: "Continua modifica", style: "cancel" },
            { text: "Esci", style: "destructive", onPress: exitEditMode },
          ],
        );
      } else {
        exitEditMode();
      }
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    exitEditMode();
    try {
      await updateTeam(teamId, {
        name: trimmed,
        logoUrl: editLogoUri,
        sport: editSport,
      });
      qc.invalidateQueries({ queryKey: queryKeys.teamDetail(teamId) });
    } catch {
      // optimistic update reverts on error
    }
  };

  const handlePickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setEditLogoUri(result.assets[0].uri);
    }
  };

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

  const handleSaveJersey = async () => {
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

  return (
    <View style={tds.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header gradient */}
        <LinearGradient colors={colorGradient} style={tds.header}>
          <SafeAreaView edges={["top"]}>
            <View style={tds.headerTop}>
              <ButtonBack handleBtn={handleBackPress} />

              {editMode ? (
                <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
                  <Text style={tds.saveBtn}>Salva</Text>
                </TouchableOpacity>
              ) : (
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
              )}
            </View>

            <View style={tds.headerBody}>
              {/* Avatar */}
              {editMode ? (
                <TouchableOpacity
                  style={{ position: "relative" }}
                  onPress={handlePickLogo}
                  activeOpacity={0.8}
                >
                  <View style={tds.teamAvatarLarge}>
                    {editLogoUri ? (
                      <Image
                        source={{ uri: editLogoUri }}
                        style={tds.teamAvatarImage}
                      />
                    ) : (
                      <Text style={tds.teamAvatarLargeText}>{initials}</Text>
                    )}
                  </View>
                  <View style={tds.avatarEditBadge}>
                    <Ionicons name="pencil" size={12} color={colors.white} />
                  </View>
                </TouchableOpacity>
              ) : (
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
              )}

              {/* Name */}
              {editMode ? (
                <TextInput
                  style={tds.teamNameInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Nome squadra"
                  placeholderTextColor={colors.grayOpacized}
                  maxLength={40}
                  autoCorrect={false}
                  selectTextOnFocus
                />
              ) : (
                <Text style={tds.teamName}>{teamDetail.name}</Text>
              )}

              {editMode ? (
                <TouchableOpacity
                  style={tds.sportSelectBtn}
                  onPress={() => setSportPickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="football" size={12} color={colors.white} />
                  <Text style={tds.sportSelectText}>
                    {editSport || "Seleziona sport"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={12}
                    color={colors.grayOpacized}
                  />
                </TouchableOpacity>
              ) : (
                <View style={tds.sportChip}>
                  <Ionicons name="football" size={12} color={colors.white} />
                  <Text style={tds.sportChipText}>{teamDetail.sport}</Text>
                </View>
              )}
              <Text style={tds.membersCount}>{members.length} giocatori</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── Tab bar (hidden in edit mode) ────────── */}
        {!editMode && (
          <TabSwitcher
            TABS={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {/* ── MEMBRI TAB (also shown in edit mode) ── */}
        {(activeTab === TeamTab.MEMBER || editMode) && (
          <Members
            isRep={isRep}
            editMode={editMode}
            setConfirmTarget={setConfirmTarget}
            setRoleTarget={setRoleTarget}
            setJerseyTarget={setJerseyTarget}
            setJerseyInput={setJerseyInput}
            teamId={teamId}
            members={members}
          />
        )}

        {/* ── STATISTICHE TAB ───────────────────────── */}
        {activeTab === TeamTab.STATS && !editMode && (
          <Stats teamId={teamId} activeTab={activeTab} />
        )}

        {/* ── CLASSIFICA MARCATORI TAB ──────────────── */}
        {activeTab === TeamTab.CLASSIFICATION_GOLEADOR && !editMode && (
          <ClassificationGoleador teamId={teamId} activeTab={activeTab} />
        )}

        {/* ── TORNEI TAB ────────────────────────────── */}
        {activeTab === TeamTab.TOURNAMENTS && !editMode && (
          <Tournaments teamId={teamId} activeTab={activeTab} />
        )}
      </ScrollView>

      {/* Remove member confirmation modal */}
      <ModalCenter
        visible={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
        handleBtnCancel={() => setConfirmTarget(null)}
        handleBtnApprove={() => {
          if (confirmTarget) {
            handleRemoveMember(confirmTarget.user_id);
            setConfirmTarget(null);
          }
        }}
        title="Rimuovi giocatore"
      >
        <View style={tds.modalAvatar}>
          <Text style={tds.modalAvatarText}>
            {confirmTarget
              ? (confirmTarget.firstName ? confirmTarget.firstName[0] : "") +
                (confirmTarget.lastName ? confirmTarget.lastName[0] : "")
              : ""}
          </Text>
        </View>
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
      </ModalCenter>

      {/* Role picker modal */}
      <ModalCenter
        visible={roleTarget !== null}
        onClose={() => setRoleTarget(null)}
        handleBtnCancel={() => setRoleTarget(null)}
        title="Cambia ruolo"
      >
        <Text style={[tds.modalBody, { marginBottom: 20 }]}>
          {roleTarget?.firstName} {roleTarget?.lastName}
        </Text>
        {[TeamRole.PLAYER, TeamRole.GOLKEEPER, TeamRole.COACH].map((role) => {
          if (role === TeamRole.REPRESENTATIVE) return null;
          const roleTargetIsRep = roleTarget?.role === "representative";
          const isCurrent = roleTargetIsRep
            ? roleTarget?.gameRole === role
            : roleTarget?.role === role;
          const isOccupied =
            !isCurrent &&
            (role === TeamRole.COACH || role === TeamRole.GOLKEEPER) &&
            members.some(
              (m: TeamMemberResponse) =>
                (m.role === role || m.gameRole === role) &&
                m.user_id !== roleTarget?.user_id,
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
        })}
      </ModalCenter>

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
              <>
                <ButtonGeneric style={tds.menuItem} handleBtn={enterEditMode}>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={colors.dark}
                  />
                  <Text style={tds.menuItemText}>Modifica squadra</Text>
                </ButtonGeneric>
                <ButtonGeneric
                  style={tds.menuItem}
                  handleBtn={() => {
                    setMenuVisible(false);
                    navigation.navigate(NavigationEnum.INVITE_PLAYERS, {
                      teamId: teamDetail.id,
                    });
                  }}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color={colors.dark}
                  />
                  <Text style={tds.menuItemText}>Invita giocatori</Text>
                </ButtonGeneric>
              </>
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
      <ModalCenter
        visible={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        handleBtnCancel={() => setConfirmLeave(false)}
        handleBtnApprove={async () => {
          setConfirmLeave(false);
          await leaveTeam(teamId);
          navigation.goBack();
        }}
        title="Lascia squadra"
      >
        <View style={tds.modalAvatar}>
          <Ionicons name="exit-outline" size={28} color={colors.danger} />
        </View>
        <Text style={tds.modalBody}>
          Sei sicuro di voler lasciare{"\n"}
          <Text style={tds.modalMemberName}>{teamDetail.name}</Text>?
        </Text>
        <Text style={tds.modalWarning}>
          Questa azione non può essere annullata.
        </Text>
      </ModalCenter>

      {/* Delete team confirmation modal */}
      <ModalCenter
        visible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        handleBtnCancel={() => setConfirmDelete(false)}
        handleBtnApprove={async () => {
          setConfirmDelete(false);
          await deleteTeam(teamId);
          navigation.goBack();
        }}
        title="Elimina squadra"
      >
        <View style={tds.modalAvatar}>
          <Ionicons name="trash-outline" size={28} color={colors.danger} />
        </View>
        <Text style={tds.modalBody}>
          Sei sicuro di voler eliminare{"\n"}
          <Text style={tds.modalMemberName}>{teamDetail.name}</Text>?
        </Text>
        <Text style={tds.modalWarning}>
          Tutti i membri verranno rimossi. Questa azione non può essere
          annullata.
        </Text>
      </ModalCenter>

      {/* Jersey number edit modal (only accessible in edit mode) */}
      <ModalCenter
        visible={jerseyTarget !== null}
        onClose={() => setJerseyTarget(null)}
        handleBtnCancel={() => setJerseyTarget(null)}
        handleBtnApprove={() => handleSaveJersey()}
        title="Numero di maglia"
      >
        <Text style={[tds.modalBody, { marginBottom: 16 }]}>
          {jerseyTarget?.firstName} {jerseyTarget?.lastName}
        </Text>
        <TextInput
          style={tds.inputJersey}
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
      </ModalCenter>

      {/* Sport picker modal */}
      <ModalCenter
        visible={sportPickerVisible}
        onClose={() => setSportPickerVisible(false)}
        handleBtnCancel={() => setSportPickerVisible(false)}
        title="Seleziona sport"
      >
        {GAMES.map((g) => {
          const isSelected = editSport === g;
          return (
            <ButtonGeneric
              key={g}
              style={[tds.roleOption, isSelected && tds.roleOptionCurrent]}
              handleBtn={() => {
                setEditSport(g);
                setSportPickerVisible(false);
              }}
            >
              <Text
                style={[
                  tds.roleOptionText,
                  isSelected && tds.roleOptionTextCurrent,
                ]}
              >
                {g}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.primaryGradientMid}
                />
              )}
            </ButtonGeneric>
          );
        })}
      </ModalCenter>
    </View>
  );
}
