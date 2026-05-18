import React from "react";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../../theme/colors";
import { styles } from "./HeaderCard.styled";

interface HeaderCardBaseProps {
  saving?: boolean;
  edit?: boolean;
  children: React.ReactNode;
}

export const HeaderCardProfile = ({
  saving = false,
  edit = false,
  children,
}: HeaderCardBaseProps) => {
  return (
    <View style={[styles.card, edit && styles.cardEdit]}>
      {children}
      {saving && (
        <View style={styles.cardSavingOverlay}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </View>
  );
};
