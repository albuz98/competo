import React from "react";
import { User } from "../../types";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";
import { Text, Image } from "react-native";
import { styles } from "./Avatar.styles";

interface AvatarProps {
  user: User | null;
}

export function Avatar({ user }: AvatarProps) {
  const initial = `${user?.firstName[0]?.toUpperCase()}${user?.lastName[0]?.toUpperCase()}`;

  return (
    <>
      {user && user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
      ) : (
        <LinearGradient
          colors={[
            colors.primary,
            colors.primaryGradientMid,
            colors.primaryGradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </LinearGradient>
      )}
    </>
  );
}
