import React, { useState } from "react";
import { ActivityIndicator, Alert, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";
import { formatDateOfBirth } from "../../functions/general";
import { colors } from "../../theme/colors";
import { Gender } from "../../types/user";
import { sizesEnum } from "../../theme/dimension";
import { UpdateProfileData } from "../../types/auth";
import { User } from "../../types/user";
import { AvatarData, Avatar } from "../core/Avatar/Avatar";
import { ButtonIcon, ButtonBorderColored } from "../core/Button/Button";
import { ModalViewer } from "../core/Modal/Modal";
import { styles } from "./HeaderCard.styled";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { GENDER_ICONS, GENDER_LABELS } from "../../constants/user";

interface HeaderCardProps {
  user: User | null;
  avatarProfile?: AvatarData;
  displayName?: string;
  subtitle?: string;
  hideName?: boolean;
  birthdate?: string;
  gender?: Gender;
  saving: boolean;
  children: React.ReactNode;
  edit: boolean;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  handleStartEdit?: () => void;
}

export const HeaderCardProfile = ({
  user,
  avatarProfile,
  displayName,
  subtitle,
  hideName = false,
  birthdate,
  gender,
  saving,
  children,
  edit,
  updateProfile,
  handleStartEdit,
}: HeaderCardProps) => {
  const [qrOpen, setQrOpen] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const profileName = displayName ?? user?.username ?? "";
  const qrValue = `https://competo.app/u/${user?.username ?? "user"}`;

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
    <>
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
          <View style={styles.infoSection}>
            {/* Testo info */}
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
              }}
            >
              {!hideName && (
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={13} color={colors.primary} />
                  <Text style={styles.infoText}>
                    {displayName ??
                      (`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                        (user?.username ?? ""))}
                  </Text>
                </View>
              )}
              {(subtitle ?? user?.location) ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-sharp"
                    size={13}
                    color={colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {subtitle ?? user?.location}
                  </Text>
                </View>
              ) : null}
              {birthdate ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {formatDateOfBirth(birthdate)}
                  </Text>
                </View>
              ) : null}
              {gender ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name={GENDER_ICONS[gender]}
                    size={13}
                    color={colors.primary}
                  />
                  <Text style={styles.infoText}>{GENDER_LABELS[gender]}</Text>
                </View>
              ) : null}
            </View>

            {/* Azioni destra */}
            <View style={styles.actionsCol}>
              {handleStartEdit && (
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
              )}
              <ButtonIcon
                handleBtn={() => setQrOpen(true)}
                icon={
                  <Ionicons
                    name="qr-code-outline"
                    size={18}
                    color={colors.primary}
                  />
                }
                style={styles.qrBtn}
              />
            </View>
          </View>
        )}

        {edit && children}
        {saving && (
          <View style={styles.cardSavingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}
      </View>

      {edit && (
        <Pressable onPress={() => navigation.navigate("ChangePassword")}>
          <View style={styles.changePasswordBtn}>
            <Text style={styles.changePasswordText}>Cambia password</Text>
            <SimpleLineIcons name="arrow-right" size={20} color="black" />
          </View>
        </Pressable>
      )}

      {/* ── QR Modal ─────────────────────────────────────────── */}
      <ModalViewer
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        withKeyboardAvoid={false}
        paddingBottom={48}
      >
        <View style={styles.qrModalContent}>
          <Text style={styles.qrModalTitle}>Condividi profilo</Text>
          <Text style={styles.qrModalSub}>@{profileName}</Text>

          <View style={styles.qrWrapper}>
            <QRCode
              value={qrValue}
              size={190}
              color={colors.dark}
              backgroundColor={colors.white}
            />
          </View>

          <Text style={styles.qrUrl}>competo.app/u/{user?.username}</Text>
          <Text style={styles.qrHint}>
            Scansiona il codice per visitare il profilo
          </Text>
        </View>
      </ModalViewer>
    </>
  );
};
