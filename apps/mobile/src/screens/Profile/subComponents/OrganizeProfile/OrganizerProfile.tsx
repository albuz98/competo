import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import {
  ButtonGeneric,
  ButtonLink,
} from "../../../../components/Button/Button";
import { LinearGradient } from "expo-linear-gradient";
import {
  NavigationEnum,
  type MyTournament,
  type OrganizerProfile as OrganizerProfileType,
  type RootStackParamList,
  type UpdateProfileData,
  type User,
} from "../../../../types";
import { colorGradient, colors } from "../../../../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./OrganizerProfile.styled";
import { HeaderCard } from "../HeaderCard/HeaderCard";
import { getProfileSubtitle } from "../../../../functions/profile";
import { InputBoxRow } from "../../../../components/InputBoxRow/InputBoxRow";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface OrganizerProfileProps {
  selectedProfile: OrganizerProfileType | null;
  orgTournaments: MyTournament[];
  loadingOrgTournaments: boolean;
  user: User;
  saving: boolean;
  edit: boolean;
  orgName: string;
  onOrgNameChange: (v: string) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateOrgProfileData: (
    profileId: string,
    updates: Partial<OrganizerProfileType>,
  ) => void;
  handleStartEdit: () => void;
}

export const OrganizerProfile = ({
  selectedProfile,
  orgTournaments,
  loadingOrgTournaments,
  user,
  saving,
  edit,
  orgName,
  onOrgNameChange,
  updateProfile,
  updateOrgProfileData,
  handleStartEdit,
}: OrganizerProfileProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expandedCollaborators, setExpandedCollaborators] = useState(false);

  const handleOrgUpdateProfile = async (data: UpdateProfileData) => {
    if (data.avatarUrl !== undefined && selectedProfile) {
      updateOrgProfileData(selectedProfile.id, { avatarUrl: data.avatarUrl });
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

  const collaborators = selectedProfile?.collaborators ?? [];

  return (
    <>
      {/* ── Header card (avatar + nome org + modifica) ───── */}
      <HeaderCard
        user={user}
        avatarProfile={selectedProfile ?? undefined}
        displayName={selectedProfile?.orgName}
        subtitle={getProfileSubtitle(selectedProfile, user)}
        saving={saving}
        edit={edit}
        updateProfile={handleOrgUpdateProfile}
        handleStartEdit={handleStartEdit}
        hideName
      >
        {/* Campi modificabili in edit mode */}
        <InputBoxRow
          label="Nome organizzazione"
          value={orgName}
          onChangeText={onOrgNameChange}
          isLast
        />
      </HeaderCard>

      {/* ── Collaboratori (visualizzazione) ─────────────── */}
      {edit && selectedProfile?.isCreator && (
        <>
          <Pressable
            onPress={toggleCollaborators}
            style={styles.collaboratorRow}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={styles.orgSectionTitle}>Collaboratori</Text>
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
                    style={[styles.collaboratorRow, { marginVertical: 5 }]}
                  >
                    <View style={styles.collaboratorAvatar}>
                      <Text style={styles.collaboratorAvatarText}>
                        {collab.firstName.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.collaboratorInfo}>
                      <Text style={styles.collaboratorName}>
                        {collab.firstName} {collab.lastName}
                      </Text>
                      <Text style={styles.collaboratorUsername}>
                        @{collab.username}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyOrgState}>
                  <Text style={styles.emptyOrgText}>
                    Nessun collaboratore ancora invitato
                  </Text>
                </View>
              )}
              <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
                <ButtonLink
                  text="+ Invita collaboratore"
                  handleBtn={() =>
                    selectedProfile &&
                    navigation.navigate(NavigationEnum.INVITE_COLLABORATORS, {
                      profileId: selectedProfile.id,
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
      {!edit && (
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
                  <View style={styles.orgSectionHeader}>
                    <Text style={styles.orgSectionTitle}>{labels[status]}</Text>
                    <Text style={styles.orgSectionCount}>{list.length}</Text>
                  </View>
                  {list.map((tournament) => (
                    <View key={tournament.id} style={styles.orgTournamentCard}>
                      <View style={styles.orgTournamentIcon}>
                        <Ionicons
                          name={icons[status]}
                          size={20}
                          color={getStatusChipColor(status)}
                        />
                      </View>
                      <View style={styles.orgTournamentInfo}>
                        <Text style={styles.orgTournamentName}>
                          {tournament.name}
                        </Text>
                        <Text style={styles.orgTournamentMeta}>
                          {tournament.game} • {tournament.location}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.orgTournamentChip,
                          { backgroundColor: getStatusChipColor(status) },
                        ]}
                      >
                        <Text style={styles.orgTournamentChipText}>
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
              <View style={styles.emptyOrgState}>
                <Text style={styles.emptyOrgText}>
                  Nessun torneo organizzato ancora
                </Text>
              </View>
            )}
          </>
        ))}
    </>
  );
};
