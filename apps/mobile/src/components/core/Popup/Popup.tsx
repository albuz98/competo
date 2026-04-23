import React from "react";
import { Modal, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { styles } from "./Popup.styled";
import { ButtonGeneric } from "../Button/Button";

type PopupVariant = "neutral" | "warning";

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: PopupVariant;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Popup({
  visible,
  onClose,
  title,
  message,
  variant = "neutral",
  icon,
}: PopupProps) {
  const isWarning = variant === "warning";

  const defaultIcon: keyof typeof Ionicons.glyphMap = isWarning
    ? "time-outline"
    : "information-circle-outline";

  const iconColor = isWarning ? colors.primaryGradientMid : colors.placeholder;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            isWarning ? styles.cardWarning : styles.cardNeutral,
          ]}
        >
          <View style={styles.header}>
            <Ionicons name={icon ?? defaultIcon} size={22} color={iconColor} />
            <View style={styles.body}>
              <Text
                style={[
                  styles.title,
                  isWarning ? styles.titleWarning : styles.titleNeutral,
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.message,
                  isWarning ? styles.messageWarning : styles.messageNeutral,
                ]}
              >
                {message}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, isWarning && styles.dividerWarning]} />
          <ButtonGeneric
            handleBtn={onClose}
            style={[
              styles.okButton,
              isWarning ? styles.okButtonWarning : styles.okButtonNeutral,
            ]}
          >
            <Text
              style={[
                styles.okButtonText,
                isWarning
                  ? styles.okButtonTextWarning
                  : styles.okButtonTextNeutral,
              ]}
            >
              OK
            </Text>
          </ButtonGeneric>
        </View>
      </View>
    </Modal>
  );
}
