import React from "react";
import { Pressable, View, Text } from "react-native";
import { ButtonIcon, ButtonLink } from "../core/Button/Button";
import { colors } from "../../theme/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import { UserRole } from "../../constants/user";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { styles } from "./TopBarPropfile.styled";
import { UserProfile } from "../../types/user";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface TopBarProfileProps {
  handleSave: () => void;
  setChangeProfileModal: (open: boolean) => void;
  edit: boolean;
  currentProfile: UserProfile | null;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export const TopBarProfile = ({
  handleSave,
  setChangeProfileModal,
  edit,
  currentProfile,
  navigation,
}: TopBarProfileProps) => {
  console.log("🚀 --------------------------------🚀");
  console.log("🚀 > TopBarProfile > edit:", edit);
  console.log("🚀 --------------------------------🚀");

  const handleOpenSettings = () => {
    navigation.navigate(NavigationEnum.SETTINGS);
  };

  return (
    <Pressable onPress={() => !edit && setChangeProfileModal(true)}>
      <View style={styles.header}>
        {!edit ? (
          <View style={styles.containerHeaderText}>
            <Text style={styles.headerText}>
              {currentProfile?.role === UserRole.ORGANIZER
                ? currentProfile.orgName
                : currentProfile?.username}
            </Text>
            <Entypo name="chevron-down" size={20} color="black" />
          </View>
        ) : (
          <Text style={styles.headerText}>Modifica profilo</Text>
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
