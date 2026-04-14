import React from "react";
import { ActivityIndicator, Alert, View, Text } from "react-native";
import { Avatar, AvatarData } from "../../../../components/Avatar/Avatar";
import {
  ButtonBorderColored,
  ButtonIcon,
} from "../../../../components/Button/Button";
import { UpdateProfileData, User } from "../../../../types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../../../theme/colors";
import { sizesEnum } from "../../../../theme/dimension";
import { styles } from "./HeaderCard.styled";

interface HeaderCardProps {
  user: User | null;
  avatarProfile?: AvatarData;
  displayName?: string;
  subtitle?: string;
  saving: boolean;
  children: React.ReactNode;
  edit: boolean;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  handleStartEdit: () => void;
}

export const HeaderCard = ({
  user,
  avatarProfile,
  displayName,
  subtitle,
  saving,
  children,
  edit,
  updateProfile,
  handleStartEdit,
}: HeaderCardProps) => {
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permesso negato",
        "Abilita l'accesso alla galleria nelle impostazioni.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      await updateProfile({ avatarUrl: result.assets[0].uri });
    }
  };

  return (
    <View style={[styles.card, edit && styles.cardEdit]}>
      {/* Avatar + pencil */}
      <View style={styles.avatarWrapper}>
        <Avatar user={avatarProfile ?? user} />
        {edit && (
          <ButtonIcon
            icon={<Ionicons name="pencil" size={13} color={colors.white} />}
            style={styles.pencilBtn}
            handleBtn={handlePickAvatar}
          />
        )}
      </View>
      {!edit && (
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={{ marginTop: 5 }}>
            <Text style={styles.username}>{displayName ?? user?.username}</Text>
            <Text style={styles.email}>{subtitle ?? user?.location}</Text>
          </View>
          <ButtonBorderColored
            isColored
            handleBtn={handleStartEdit}
            size={sizesEnum.medium}
            text="Modifica"
            iconLeft={
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            }
          />
        </View>
      )}
      {edit && children}
      {saving && (
        <View style={styles.cardSavingOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </View>
  );
};
