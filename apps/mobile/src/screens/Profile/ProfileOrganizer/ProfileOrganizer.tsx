import React, { useRef, useCallback, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../context/AuthContext";
import { useTeams } from "../../../context/TeamsContext";
import { RootStackParamList, NavigationEnum } from "../../../types/navigation";
import { colorGradient, colors } from "../../../theme/colors";
import { styles as tabStyles } from "../../../navigation/MainTabNavigator/MainTabNavigator.styles";
import { useQuery } from "@tanstack/react-query";
import { fetchMyTournaments } from "../../../api/tournaments";
import { queryKeys } from "../../../lib/queryKeys";
import { OrganizerProfile, UserRole } from "../../../types/user";
import { UpdateProfileData } from "../../../types/auth";
import { styles } from "../Profile.styles";
import {
  ButtonGeneric,
  ButtonLink,
} from "../../../components/core/Button/Button";
import { oStyles } from "./ProfileOrganizer.styled";
import { HeaderCardProfile } from "../../../components/HeaderCardProfile/HeaderCard";
import { InputBoxRow } from "../../../components/core/InputBoxRow/InputBoxRow";
import { LinearGradient } from "expo-linear-gradient";
import { ModalViewer } from "../../../components/core/Modal/Modal";

interface ProfileOrganizerProps {
  currentProfile: OrganizerProfile | null;
  saving: boolean;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  onDirty?: () => void;
}

export default function ProfileOrganizer({
  currentProfile,
  saving,
  edit,
  setEdit,
  onDirty,
}: ProfileOrganizerProps) {
  const { user, updateProfile, updateOrgProfileData } = useAuth();
  const { refreshTeams } = useTeams();
  const [form, setForm] = useState({
    orgName: "",
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const isOrganizerProfile = currentProfile?.role === UserRole.ORGANIZER;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).setOptions({
      tabBarStyle: edit
        ? { display: "none" }
        : [tabStyles.tabBar, { bottom: insets.bottom + 8 }],
    });
  }, [edit]);

  const scrollRef = useRef<ScrollView>(null);
  const savedScrollY = useRef(0);

  const { data: allMyTournaments = [], isLoading: loadingOrgTournaments } =
    useQuery({
      queryKey: queryKeys.myTournaments(),
      queryFn: () => fetchMyTournaments(user?.token ?? ""),
      enabled: !!user && isOrganizerProfile,
    });
  const orgTournaments = allMyTournaments.filter((t) => t.isOrganizer);

  useFocusEffect(
    useCallback(() => {
      const y = savedScrollY.current;
      if (y > 0) {
        setTimeout(
          () => scrollRef.current?.scrollTo({ y, animated: false }),
          50,
        );
      }
      if (user) refreshTeams();
    }, [user?.id]),
  );

  const handleStartEdit = () => {
    const orgProfile =
      currentProfile?.role === UserRole.ORGANIZER ? currentProfile : null;
    if (orgProfile?.pendingApproval) {
      Alert.alert(
        "Profilo in revisione",
        "Non puoi modificare il profilo organizzatore fino all'approvazione da parte del team Competo.",
      );
      return;
    }
    setForm({
      orgName: orgProfile?.orgName ?? "",
    });
    setEdit(true);
  };

  useEffect(() => {
    if (edit) {
      setForm({ orgName: currentProfile?.orgName ?? "" });
    }
  }, [edit]);

  const [expandedCollaborators, setExpandedCollaborators] = useState(false);

  const isPending = currentProfile?.pendingApproval === true;

  const handleStartEditGuarded = () => {
    if (isPending) {
      Alert.alert(
        "Profilo in revisione",
        "Non puoi modificare il profilo organizzatore fino all'approvazione da parte del team Competo.",
      );
      return;
    }
    handleStartEdit();
  };

  const handleOrgUpdateProfile = async (data: UpdateProfileData) => {
    if (data.avatarUrl !== undefined && currentProfile) {
      updateOrgProfileData(currentProfile.id, { avatarUrl: data.avatarUrl });
      return;
    }
    return updateProfile(data);
  };

  const toggleCollaborators = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCollaborators((v) => !v);
  };

  const getTournamentsByStatus = (
    status: "upcoming" | "ongoing" | "completed",
  ) => orgTournaments.filter((t) => t.status === status);

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return colors.purpleBlue;
      case "ongoing":
        return colors.primaryGradientMid;
      case "completed":
        return colors.grayDark;
      default:
        return colors.placeholder;
    }
  };

  const collaborators = currentProfile?.collaborators ?? [];

  const countCollaborators = collaborators?.length ?? 0;

  if (!user) {
    return (
      <View style={styles.root}>
        <Text style={styles.header}>Errore nella generazione del profilo</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 90 },
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(e) => {
          savedScrollY.current = e.nativeEvent.contentOffset.y;
        }}
      >
        {isPending && (
          <View style={oStyles.pendingBanner}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primaryGradientMid}
            />
            <View style={oStyles.pendingBannerBody}>
              <Text style={oStyles.pendingBannerTitle}>
                Profilo in attesa di approvazione
              </Text>
              <Text style={oStyles.pendingBannerText}>
                Il team Competo sta verificando i tuoi documenti. Riceverai una
                notifica entro 24–48 ore. Fino all'approvazione non puoi
                modificare il profilo né creare tornei.
              </Text>
            </View>
          </View>
        )}

        {/* ── Header card (avatar + nome org + modifica) ───── */}
        <HeaderCardProfile
          user={user}
          avatarProfile={currentProfile ?? undefined}
          displayName={currentProfile?.orgName}
          subtitle={`Collaboratori ${countCollaborators}`}
          saving={saving}
          edit={edit && !isPending}
          updateProfile={handleOrgUpdateProfile}
          handleStartEdit={handleStartEditGuarded}
          hideName
        >
          {/* Campi modificabili in edit mode */}
          <InputBoxRow
            label="Nome organizzazione"
            value={form.orgName}
            onChangeText={(v) => {
              setForm((f) => ({ ...f, orgName: v }));
              onDirty?.();
            }}
            isLast
          />
        </HeaderCardProfile>

        {/* ── Collaboratori (visualizzazione) ─────────────── */}
        {edit && !isPending && currentProfile?.isCreator && (
          <>
            <Pressable
              onPress={toggleCollaborators}
              style={oStyles.collaboratorRow}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text style={oStyles.orgSectionTitle}>Collaboratori</Text>
                {collaborators.length > 0 && (
                  <Text
                    style={{
                      color: colors.primaryGradientMid,
                      fontSize: 14,
                      fontWeight: "800",
                    }}
                  >
                    {collaborators.length}
                  </Text>
                )}
              </View>
              <Ionicons
                name={expandedCollaborators ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.primary}
              />
            </Pressable>

            {expandedCollaborators && (
              <>
                {collaborators.length > 0 ? (
                  collaborators.map((collab) => (
                    <View
                      key={collab.id}
                      style={[oStyles.collaboratorRow, { marginVertical: 5 }]}
                    >
                      <View style={oStyles.collaboratorAvatar}>
                        <Text style={oStyles.collaboratorAvatarText}>
                          {collab.first_name.slice(0, 1).toUpperCase()}
                        </Text>
                      </View>
                      <View style={oStyles.collaboratorInfo}>
                        <Text style={oStyles.collaboratorName}>
                          {collab.first_name} {collab.last_name}
                        </Text>
                        <Text style={oStyles.collaboratorUsername}>
                          @{collab.username}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={oStyles.emptyOrgState}>
                    <Text style={oStyles.emptyOrgText}>
                      Nessun collaboratore ancora invitato
                    </Text>
                  </View>
                )}
                <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
                  <ButtonLink
                    text="+ Invita collaboratore"
                    handleBtn={() =>
                      currentProfile &&
                      navigation.navigate(NavigationEnum.INVITE_COLLABORATORS, {
                        profileId: currentProfile.id,
                      })
                    }
                    color={colors.primary}
                    fontSize={13}
                    isColored
                    isBold
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* ── Crea nuovo torneo ────────────────────────────── */}
        {!edit && !isPending && (
          <View style={{ marginVertical: 20 }}>
            <ButtonGeneric
              style={styles.createTeamCard}
              handleBtn={() =>
                navigation.navigate(NavigationEnum.CREATE_TOURNAMENT_SCHEDULE)
              }
            >
              <LinearGradient
                colors={colorGradient}
                style={styles.createTeamIcon}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.white}
                />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.createTeamTitle}>Crea nuovo torneo</Text>
                <Text style={styles.createTeamSub}>
                  Genera tabelloni e calendari
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.grayDark}
              />
            </ButtonGeneric>
          </View>
        )}

        {/* ── Tornei per stato ─────────────────────────────── */}
        {!edit &&
          (loadingOrgTournaments ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {(["upcoming", "ongoing", "completed"] as const).map((status) => {
                const list = getTournamentsByStatus(status);
                if (list.length === 0) return null;
                const labels = {
                  upcoming: "In arrivo",
                  ongoing: "In corso",
                  completed: "Terminati",
                };
                const icons = {
                  upcoming: "calendar-outline",
                  ongoing: "play-circle-outline",
                  completed: "checkmark-circle-outline",
                } as const;
                return (
                  <React.Fragment key={status}>
                    <View style={oStyles.orgSectionHeader}>
                      <Text style={oStyles.orgSectionTitle}>
                        {labels[status]}
                      </Text>
                      <Text style={oStyles.orgSectionCount}>{list.length}</Text>
                    </View>
                    {list.map((tournament) => (
                      <View
                        key={tournament.id}
                        style={oStyles.orgTournamentCard}
                      >
                        <View style={oStyles.orgTournamentIcon}>
                          <Ionicons
                            name={icons[status]}
                            size={20}
                            color={getStatusChipColor(status)}
                          />
                        </View>
                        <View style={oStyles.orgTournamentInfo}>
                          <Text style={oStyles.orgTournamentName}>
                            {tournament.name}
                          </Text>
                          <Text style={oStyles.orgTournamentMeta}>
                            {tournament.game} • {tournament.location}
                          </Text>
                        </View>
                        <View
                          style={[
                            oStyles.orgTournamentChip,
                            { backgroundColor: getStatusChipColor(status) },
                          ]}
                        >
                          <Text style={oStyles.orgTournamentChipText}>
                            {tournament.currentParticipants}/
                            {tournament.maxParticipants}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </React.Fragment>
                );
              })}
              {orgTournaments.length === 0 && (
                <View style={oStyles.emptyOrgState}>
                  <Text style={oStyles.emptyOrgText}>
                    Nessun torneo organizzato ancora
                  </Text>
                </View>
              )}
            </>
          ))}
      </ScrollView>
      <ModalViewer
        isOpen={changeProfileModal}
        onClose={() => setChangeProfileModal(false)}
      >
        <View style={styles.headerModal}>
          <Text style={styles.headerModalText}>I tuoi profili</Text>
          <Pressable
            onPress={() => {
              setChangeProfileModal(false);
              navigation.navigate(NavigationEnum.CREATE_ORGANIZER_PROFILE);
            }}
            hitSlop={8}
          >
            <Ionicons name="add" size={24} color={colors.primaryGradientMid} />
          </Pressable>
        </View>
      </ModalViewer>
    </View>
  );
}
