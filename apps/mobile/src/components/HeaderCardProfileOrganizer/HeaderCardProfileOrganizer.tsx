import React from "react";
import { Alert, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { colors, colorGradient } from "../../theme/colors";
import { UpdateProfileData } from "../../types/auth";
import { User, OrganizerProfile } from "../../types/user";
import { Avatar } from "../core/Avatar/Avatar";
import { ButtonIcon } from "../core/Button/Button";
import { styles } from "./HeaderCardProfileOrganizer.styled";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { HeaderCardProfile } from "../HeaderCardProfile/HeaderCard";

interface HeaderCardProfileOrganizerProps {
  user: User | null;
  currentProfile: OrganizerProfile | null;
  saving: boolean;
  edit: boolean;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  handleStartEdit?: () => void;
  children?: React.ReactNode;
}

export const HeaderCardProfileOrganizer = ({
  user: _user,
  currentProfile,
  saving,
  edit,
  updateProfile,
  children,
}: HeaderCardProfileOrganizerProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const collaboratorCount = currentProfile?.collaborators?.length ?? 0;
  const isVerified = currentProfile?.isVerified ?? false;
  const isPremium = currentProfile?.isPremium ?? false;

  const handlePickLogo = async () => {
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
    <>
      <HeaderCardProfile saving={saving} edit={edit}>
        {/* Company logo / icon */}
        <View style={styles.iconWrapper}>
          <Avatar user={currentProfile} />
          {edit && (
            <ButtonIcon
              icon={<Ionicons name="pencil" size={13} color={colors.white} />}
              style={styles.pencilBtn}
              handleBtn={handlePickLogo}
            />
          )}
        </View>

        {!edit ? (
          <>
            {/* Middle: org name + collaborators + edit button */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="business" size={13} color={colors.primary} />
                <Text style={styles.orgName} numberOfLines={2}>
                  {currentProfile?.orgName ?? ""}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="people-outline"
                  size={13}
                  color={colors.primary}
                />
                <Text style={styles.infoText}>
                  {collaboratorCount}{" "}
                  {collaboratorCount === 1 ? "collaboratore" : "collaboratori"}
                </Text>
              </View>
            </View>

            {/* Right: verified + premium badges */}
            {(isVerified || isPremium) && (
              <View style={styles.badgesCol}>
                {isVerified && (
                  <View style={styles.badgeItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={26}
                      color={colors.success}
                    />
                  </View>
                )}
                {isPremium && (
                  <View style={styles.badgeItem}>
                    <Ionicons name="star" size={24} color={colors.gold} />
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          children
        )}
      </HeaderCardProfile>

      {/* Change password (edit mode) */}
      {edit && (
        <Pressable onPress={() => navigation.navigate("ChangePassword")}>
          <View style={styles.changePasswordBtn}>
            <Text style={styles.changePasswordText}>Cambia password</Text>
            <SimpleLineIcons name="arrow-right" size={20} color="black" />
          </View>
        </Pressable>
      )}

      {/* Premium upgrade banner (shown only when not premium and not in edit) */}
      {!edit && !isPremium && (
        <LinearGradient
          colors={colorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.premiumBanner}
        >
          <View>
            <Text style={styles.premiumText}>Upgrade to premium</Text>
            <Text style={styles.premiumInfoText}>
              Sblocca le funzionalità premium
            </Text>
          </View>
          <Ionicons name="star" size={28} color={colors.white} />
        </LinearGradient>
      )}
    </>
  );
};
