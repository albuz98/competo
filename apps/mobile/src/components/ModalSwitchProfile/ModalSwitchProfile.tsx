import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { colors, colorGradient } from "../../theme/colors";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { User, UserProfile, UserRole } from "../../types/user";
import { styles } from "./ModalSwitchProfile.styled";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CardIcon from "../../../assets/icons/whistle.svg";
import { ModalViewer } from "../core/ModalBottom/ModalBottom";
interface ModalSwitchProfileProps {
  changeProfileModal: boolean;
  setChangeProfileModal: (open: boolean) => void;
  switchProfile: (profileId: number) => void;
  user: User;
  currentProfile: UserProfile | null;
}

export const ModalSwitchProfile = ({
  changeProfileModal,
  setChangeProfileModal,
  switchProfile,
  user,
  currentProfile,
}: ModalSwitchProfileProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSwitchProfile = (profile: UserProfile) => {
    switchProfile(profile.id);
    setChangeProfileModal(false);
  };

  const renderProfileAvatar = (profile: UserProfile) => {
    const avatarUrl =
      profile.role === UserRole.PLAYER
        ? (profile.avatarUrl ?? user.avatarUrl)
        : profile.role === UserRole.ORGANIZER
          ? profile.avatarUrl
          : undefined;

    if (avatarUrl) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      );
    }

    const icon: React.ReactNode =
      profile.role === UserRole.ORGANIZER ? (
        <Ionicons name="business" size={20} color={colors.white} />
      ) : profile.role === UserRole.REFEREE ? (
        <CardIcon width={20} height={20} color={colors.white} />
      ) : profile.role === UserRole.PLAYER ? (
        <Ionicons name="person" size={20} color={colors.white} />
      ) : null;

    return (
      <LinearGradient
        colors={colorGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </LinearGradient>
    );
  };

  return (
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
      {user?.profiles && user.profiles.length > 0 ? (
        <View style={{ gap: 10 }}>
          {user.profiles.map((profile) => (
            <Pressable
              key={profile.id}
              onPress={() => handleSwitchProfile(profile)}
              style={[
                styles.containerProfileModal,
                {
                  borderColor:
                    currentProfile?.id === profile.id
                      ? colors.primary
                      : colors.gray,
                },
              ]}
            >
              {renderProfileAvatar(profile)}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: colors.dark,
                  }}
                >
                  {profile.role === UserRole.ORGANIZER
                    ? profile.orgName
                    : profile.role === UserRole.REFEREE
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.username}
                </Text>
                {profile.role === UserRole.PLAYER &&
                  (user?.first_name || user?.last_name) && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.placeholder,
                        marginTop: 2,
                      }}
                    >
                      {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
                    </Text>
                  )}
                {profile.role === UserRole.ORGANIZER && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.placeholder,
                      marginTop: 2,
                    }}
                  >
                    {`${profile.collaborators?.length ?? 0} collaborator${(profile.collaborators?.length ?? 0) === 1 ? "e" : "i"}`}
                  </Text>
                )}
                {profile.role === UserRole.REFEREE && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.placeholder,
                      marginTop: 2,
                    }}
                  >
                    {profile.pendingApproval
                      ? "In attesa di verifica"
                      : `Arbitro · ${profile.categories.join(", ")}`}
                  </Text>
                )}
              </View>
              {currentProfile?.id === profile.id && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </Pressable>
          ))}
        </View>
      ) : (
        <Text
          style={{
            fontSize: 14,
            color: colors.placeholder,
            textAlign: "center",
            marginVertical: 20,
          }}
        >
          Nessun profilo disponibile
        </Text>
      )}
    </ModalViewer>
  );
};
