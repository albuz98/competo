import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colorGradient } from "../../theme/colors";
import { Text, Image } from "react-native";
import { styles } from "./Avatar.styles";
import { sizesEnum } from "../../theme/dimension";

export interface AvatarData {
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  orgName?: string;
}

interface AvatarProps {
  user: AvatarData | null;
  dimension?: sizesEnum;
}

export function Avatar({ user, dimension = sizesEnum.big }: AvatarProps) {
  const initial =
    user?.orgName?.slice(0, 2).toUpperCase() ||
    `${user?.firstName?.[0]?.toUpperCase()}${user?.lastName?.[0]?.toUpperCase()}`;
  const size = dimension === sizesEnum.small ? 40 : 72;
  const sizeFont = dimension === sizesEnum.small ? 16 : 22;

  return (
    <>
      {user && user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
      ) : (
        <LinearGradient
          colors={colorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.avatar, { width: size, height: size }]}
        >
          <Text style={[styles.avatarText, { fontSize: sizeFont }]}>
            {initial}
          </Text>
        </LinearGradient>
      )}
    </>
  );
}
