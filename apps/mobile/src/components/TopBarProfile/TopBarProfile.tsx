import React from "react";
import { Pressable, View, Text } from "react-native";
import { ButtonBack, ButtonIcon, ButtonLink } from "../core/Button/Button";
import { colors } from "../../theme/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { styles } from "./TopBarPropfile.styled";
import { UserProfile, UserRole } from "../../types/user";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";

interface TopBarProfileProps {
  handleSave: () => void;
  handleDiscard: () => void;
  setChangeProfileModal: (open: boolean) => void;
  edit: boolean;
  currentProfile: UserProfile | null;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export const TopBarProfile = ({
  handleSave,
  handleDiscard,
  setChangeProfileModal,
  edit,
  currentProfile,
  navigation,
}: TopBarProfileProps) => {
  const { user } = useAuth();

  const hasMultipleProfile = user?.profiles?.length! > 1;

  const handleOpenSettings = () => {
    navigation.navigate(NavigationEnum.SETTINGS);
  };

  return (
    <Pressable
      onPress={() => hasMultipleProfile && !edit && setChangeProfileModal(true)}
    >
      <View style={styles.header}>
        {!edit ? (
          <View style={styles.containerHeaderText}>
            <Text style={styles.headerText}>
              {currentProfile?.role === UserRole.ORGANIZER
                ? currentProfile.orgName
                : currentProfile?.username}
            </Text>
            {hasMultipleProfile && (
              <Entypo name="chevron-down" size={20} color="black" />
            )}
          </View>
        ) : (
          <View style={styles.containerHeaderText}>
            <ButtonBack handleBtn={handleDiscard} isArrowBack={false} />
            <Text style={styles.headerText}>Modifica profilo</Text>
          </View>
        )}
        {edit ? (
          <ButtonLink
            text="FATTO"
            handleBtn={handleSave}
            color={colors.primary}
            fontSize={16}
            isBold
            isColored
          />
        ) : (
          <ButtonIcon
            handleBtn={handleOpenSettings}
            icon={
              <Ionicons
                name="settings-outline"
                size={22}
                color={colors.primary}
              />
            }
          />
        )}
      </View>
    </Pressable>
  );
};
