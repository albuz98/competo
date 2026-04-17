import React, { useState } from "react";
import { ActivityIndicator, Alert, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import QRCode from "react-native-qrcode-svg";
import { formatDateOfBirth } from "../../functions/general";
import { colors } from "../../theme/colors";
import { sizesEnum } from "../../theme/dimension";
import { UpdateProfileData } from "../../types/auth";
import { User } from "../../types/user";
import { AvatarData, Avatar } from "../core/Avatar/Avatar";
import { ButtonIcon, ButtonBorderColored } from "../core/Button/Button";
import { ModalViewer } from "../core/Modal/Modal";
import { styles } from "./HeaderCard.styled";

interface HeaderCardProps {
  user: User | null;
  avatarProfile?: AvatarData;
  displayName?: string;
  subtitle?: string;
  hideName?: boolean;
  dateOfBirth?: string;
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
  dateOfBirth,
  saving,
  children,
  edit,
  updateProfile,
  handleStartEdit,
}: HeaderCardProps) => {
  console.log("🚀 ------------------------------------🚀");
  console.log("🚀 > HeaderCardProfile > edit:", edit);
  console.log("🚀 ------------------------------------🚀");

  const [qrOpen, setQrOpen] = useState(false);

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
            <View style={{ flex: 1 }}>
              {!hideName && (
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={13} color={colors.primary} />
                  <Text style={styles.infoText}>
                    {displayName ?? `${user?.firstName} ${user?.lastName}`}
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
              {dateOfBirth ? (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={colors.primary}
                  />
                  <Text style={styles.infoText}>
                    {formatDateOfBirth(dateOfBirth)}
                  </Text>
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
