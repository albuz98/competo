import React, { useRef, useState } from "react";
import {
  Alert,
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
import {
  ROLE_LABEL,
  type TeamMemberResponse,
  type TeamTournamentRecord,
} from "../../types/team";
import { TeamRole } from "../../constants/team";
import { useTeams } from "../../context/TeamsContext";
import { useAuth } from "../../context/AuthContext";
import { colorGradient, colors } from "../../theme/colors";
import {
  ButtonBack,
  ButtonGeneric,
  ButtonIcon,
  ButtonLink,
} from "../../components/core/Button/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeamDetail,
  fetchTeamGoalScorers,
  fetchTeamMembers,
  fetchTeamInvitations,
  fetchTeamStats,
  fetchTeamTournaments,
} from "../../api/teams";
import { queryKeys } from "../../lib/queryKeys";
import { MemberRow } from "../../components/MemberRow/MemberRow";
import { RESULT_CONFIG, TournamentResult } from "../../constants/tournament";
import { GAMES } from "../../constants/generals";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetail">;
type TeamTab = "membri" | "statistiche" | "classifica" | "tornei";

const TABS: { key: TeamTab; label: string }[] = [
  { key: "membri", label: "Membri" },
  { key: "statistiche", label: "Statistiche" },
  { key: "classifica", label: "Classifica" },
  { key: "tornei", label: "Tornei" },
];

export default function TeamDetail({ route, navigation }: Props) {
  const { teamId } = route.params;
  const { updateMemberRole, deleteTeam, leaveTeam, updateTeam } = useTeams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TeamTab>("membri");
  const [expandedTournaments, setExpandedTournaments] = useState<Set<string>>(
    new Set(),
  );

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

  const { data: teamInvitations = [] } = useQuery({
    queryKey: queryKeys.teamInvitations(teamId),
    queryFn: () => fetchTeamInvitations(teamId, user!.token),
    enabled: !!user && isRep,
  });

  const { data: teamStats, isLoading: loadingStats } = useQuery({
    queryKey: queryKeys.teamStats(teamId),
    queryFn: () => fetchTeamStats(teamId, user!.token),
    enabled: !!user && activeTab === "statistiche",
  });

  const { data: goalScorers = [], isLoading: loadingScorers } = useQuery({
    queryKey: queryKeys.teamGoalScorers(teamId),
    queryFn: () => fetchTeamGoalScorers(teamId, user!.token),
    enabled: !!user && activeTab === "classifica",
  });

  const { data: teamTournaments = [], isLoading: loadingTournaments } =
    useQuery({
      queryKey: queryKeys.teamTournaments(teamId),
      queryFn: () => fetchTeamTournaments(teamId, user!.token),
      enabled: !!user && activeTab === "tornei",
    });

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

  const toggleTournament = (id: string) => {
    setExpandedTournaments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
  const coaches = sortedMembers.filter((m) => m.role === TeamRole.COACH);
  const nonCoaches = sortedMembers.filter((m) => m.role !== TeamRole.COACH);

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
                  placeholderTextColor="rgba(255,255,255,0.5)"
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
                    color="rgba(255,255,255,0.8)"
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
          <View style={tds.tabBar}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[tds.tabBtn, activeTab === tab.key && tds.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    tds.tabBtnText,
                    activeTab === tab.key && tds.tabBtnTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── MEMBRI TAB (also shown in edit mode) ── */}
        {(activeTab === "membri" || editMode) && (
          <>
            {coaches.length > 0 && (
              <View style={tds.section}>
                <Text style={tds.sectionTitle}>Allenatore</Text>
                {coaches.map((m: TeamMemberResponse) => (
                  <MemberRow
                    key={m.id}
                    member={m}
                    currentUserIsRep={isRep}
                    editMode={editMode}
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
            )}
            <View style={[tds.section, { marginTop: 12 }]}>
              <Text style={tds.sectionTitle}>Giocatori</Text>
              {nonCoaches.map((m: TeamMemberResponse) => (
                <MemberRow
                  key={m.id}
                  member={m}
                  currentUserIsRep={isRep}
                  editMode={editMode}
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
          </>
        )}

        {/* Invitations — only in non-edit mode */}
        {!editMode && isRep && teamInvitations.length > 0 && (
          <View style={[tds.section, { marginTop: 12 }]}>
            <Text style={tds.sectionTitle}>INVITI</Text>
            {teamInvitations.map((invite) => {
              const name =
                invite.firstName && invite.lastName
                  ? `${invite.firstName} ${invite.lastName}`
                  : (invite.username ?? `#${invite.invited_user_id}`);
              const ini = name.slice(0, 2).toUpperCase();
              const badgeStyle =
                invite.status === "accepted"
                  ? tds.inviteBadgeAccepted
                  : invite.status === "declined"
                    ? tds.inviteBadgeDeclined
                    : tds.pendingBadge;
              const badgeTextStyle =
                invite.status === "accepted"
                  ? tds.inviteBadgeTextAccepted
                  : invite.status === "declined"
                    ? tds.inviteBadgeTextDeclined
                    : tds.pendingBadgeText;
              const badgeLabel =
                invite.status === "accepted"
                  ? "Accettato"
                  : invite.status === "declined"
                    ? "Rifiutato"
                    : "In attesa";
              return (
                <View key={invite.id} style={tds.pendingInviteRow}>
                  <View style={tds.pendingInviteAvatar}>
                    <Text style={tds.pendingInviteAvatarText}>{ini}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={tds.pendingInviteName}>{name}</Text>
                  </View>
                  <View style={badgeStyle}>
                    <Text style={badgeTextStyle}>{badgeLabel}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── STATISTICHE TAB ───────────────────────── */}
        {activeTab === "statistiche" && !editMode && (
          <View style={{ marginTop: 16 }}>
            {loadingStats ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginTop: 32 }}
              />
            ) : teamStats ? (
              <View style={tds.statsCard}>
                <View style={tds.statsCardInner}>
                  <View style={tds.statsRow}>
                    <View style={tds.statBubble}>
                      <Text style={[tds.statNum, { color: colors.success }]}>
                        {teamStats.wins}
                      </Text>
                      <Text style={tds.statLabel}>Vittorie</Text>
                    </View>
                    <View style={tds.statDivider} />
                    <View style={tds.statBubble}>
                      <Text
                        style={[tds.statNum, { color: colors.placeholder }]}
                      >
                        {teamStats.draws}
                      </Text>
                      <Text style={tds.statLabel}>Pareggi</Text>
                    </View>
                    <View style={tds.statDivider} />
                    <View style={tds.statBubble}>
                      <Text style={[tds.statNum, { color: colors.danger }]}>
                        {teamStats.losses}
                      </Text>
                      <Text style={tds.statLabel}>Sconfitte</Text>
                    </View>
                  </View>
                  <View style={tds.statsTourneyRow}>
                    <View style={tds.statTourney}>
                      <Ionicons
                        name="trophy-outline"
                        size={18}
                        color={colors.primaryGradientMid}
                      />
                      <Text style={tds.statTourneyNum}>
                        {teamStats.tournamentsWon}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Tornei vinti</Text>
                    </View>
                    <View style={tds.statTourneyDivider} />
                    <View style={tds.statTourney}>
                      <Ionicons
                        name="medal-outline"
                        size={18}
                        color={colors.placeholder}
                      />
                      <Text style={tds.statTourneyNum}>
                        {teamStats.tournamentsPlayed}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Tornei giocati</Text>
                    </View>
                    <View style={tds.statTourneyDivider} />
                    <View style={tds.statTourney}>
                      <Ionicons
                        name="football-outline"
                        size={18}
                        color={colors.placeholder}
                      />
                      <Text style={tds.statTourneyNum}>
                        {teamStats.matchesPlayed}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Partite totali</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      tds.statsTourneyRow,
                      { borderTopWidth: 1, borderTopColor: colors.gray },
                    ]}
                  >
                    <View style={tds.statTourney}>
                      <Ionicons
                        name="football"
                        size={18}
                        color={colors.primary}
                      />
                      <Text
                        style={[tds.statTourneyNum, { color: colors.primary }]}
                      >
                        {teamStats.goalsScored}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Gol segnati</Text>
                    </View>
                    <View style={tds.statTourneyDivider} />
                    <View style={tds.statTourney}>
                      <View style={tds.cardIndicatorYellow} />
                      <Text style={tds.statTourneyNum}>
                        {teamStats.yellowCards}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Gialli</Text>
                    </View>
                    <View style={tds.statTourneyDivider} />
                    <View style={tds.statTourney}>
                      <View style={tds.cardIndicatorRed} />
                      <Text style={tds.statTourneyNum}>
                        {teamStats.redCards}
                      </Text>
                      <Text style={tds.statTourneyLabel}>Rossi</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* ── CLASSIFICA MARCATORI TAB ──────────────── */}
        {activeTab === "classifica" && !editMode && (
          <View style={{ marginTop: 16 }}>
            {loadingScorers ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginTop: 32 }}
              />
            ) : (
              <View style={tds.section}>
                <Text style={tds.sectionTitle}>Classifica marcatori</Text>
                {goalScorers.length === 0 ? (
                  <Text style={tds.emptyText}>Nessun gol registrato</Text>
                ) : (
                  goalScorers.map((scorer, idx) => (
                    <View key={scorer.playerId} style={tds.scorerRow}>
                      <View style={tds.scorerRankBox}>
                        <Text style={tds.scorerRank}>{idx + 1}</Text>
                      </View>
                      <View style={tds.scorerAvatar}>
                        <LinearGradient
                          colors={colorGradient}
                          style={tds.scorerAvatarGradient}
                        >
                          <Text style={tds.scorerAvatarText}>
                            {scorer.playerName.slice(0, 2).toUpperCase()}
                          </Text>
                        </LinearGradient>
                      </View>
                      <Text style={tds.scorerName} numberOfLines={1}>
                        {scorer.playerName}
                      </Text>
                      <View style={tds.scorerGoalsBadge}>
                        <Ionicons
                          name="football"
                          size={12}
                          color={colors.primary}
                        />
                        <Text style={tds.scorerGoals}>{scorer.goals}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}

        {/* ── TORNEI TAB ────────────────────────────── */}
        {activeTab === "tornei" && !editMode && (
          <View style={{ marginTop: 16 }}>
            {loadingTournaments ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ marginTop: 32 }}
              />
            ) : teamTournaments.length === 0 ? (
              <Text style={[tds.emptyText, { marginHorizontal: 16 }]}>
                Nessun torneo giocato
              </Text>
            ) : (
              teamTournaments
                .sort(
                  (a: TeamTournamentRecord, b: TeamTournamentRecord) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((t: TeamTournamentRecord) => {
                  const cfg = RESULT_CONFIG[t.result];
                  const expanded = expandedTournaments.has(t.id);
                  return (
                    <View key={t.id} style={tds.tournamentAccordion}>
                      <TouchableOpacity
                        style={tds.tournamentAccordionHeader}
                        onPress={() => toggleTournament(t.id)}
                        activeOpacity={0.7}
                      >
                        <View style={tds.tournamentAccordionIcon}>
                          <Text style={tds.tournamentAccordionIconText}>
                            {t.result === TournamentResult.WON
                              ? "🥇"
                              : t.result === TournamentResult.SECOND
                                ? "🥈"
                                : t.result === TournamentResult.THIRD
                                  ? "🥉"
                                  : "💔"}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={tds.tournamentAccordionName}
                            numberOfLines={1}
                          >
                            {t.name}
                          </Text>
                          <Text style={tds.tournamentAccordionMeta}>
                            {new Date(t.date).toLocaleDateString("it-IT", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · {t.location}
                          </Text>
                        </View>
                        <View
                          style={[
                            tds.tournamentBadge,
                            {
                              backgroundColor:
                                t.result === TournamentResult.ELIMINATED
                                  ? colors.gray
                                  : cfg?.color,
                            },
                          ]}
                        >
                          <Text style={tds.tournamentBadgeText}>
                            {cfg?.label}
                          </Text>
                        </View>
                        <Ionicons
                          name={expanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={colors.placeholder}
                          style={{ marginLeft: 8 }}
                        />
                      </TouchableOpacity>

                      {expanded && (
                        <View style={tds.tournamentScorers}>
                          {t.scorers.length === 0 ? (
                            <Text style={tds.emptyText}>Nessun gol</Text>
                          ) : (
                            t.scorers.map((s, i) => (
                              <View
                                key={`${s.playerId}-${i}`}
                                style={tds.tournamentScorerRow}
                              >
                                <Ionicons
                                  name="football"
                                  size={13}
                                  color={colors.primary}
                                />
                                <Text
                                  style={tds.tournamentScorerName}
                                  numberOfLines={1}
                                >
                                  {s.playerName}
                                </Text>
                                <Text style={tds.tournamentScorerGoals}>
                                  {s.goals} {s.goals === 1 ? "gol" : "gol"}
                                </Text>
                              </View>
                            ))
                          )}
                        </View>
                      )}
                    </View>
                  );
                })
            )}
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

      {/* Jersey number edit modal (only accessible in edit mode) */}
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

      {/* Sport picker modal */}
      <Modal
        visible={sportPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSportPickerVisible(false)}
      >
        <View style={tds.modalOverlay}>
          <View style={tds.modalCard}>
            <Text style={tds.modalTitle}>Seleziona sport</Text>
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
            <ButtonLink
              style={[tds.modalCancelBtn, { marginTop: 8, width: "100%" }]}
              text="Annulla"
              handleBtn={() => setSportPickerVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
