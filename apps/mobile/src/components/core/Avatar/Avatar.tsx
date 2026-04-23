import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colorGradient } from "../../../theme/colors";
import { Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Avatar.styles";
import { sizesEnum } from "../../../theme/dimension";

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
  const orgInitial = user?.orgName?.slice(0, 2).toUpperCase();
  const firstInitial = user?.firstName?.[0]?.toUpperCase();
  const lastInitial = user?.lastName?.[0]?.toUpperCase();
  const initial = orgInitial || (firstInitial || lastInitial ? `${firstInitial ?? ""}${lastInitial ?? ""}` : null);
  const size = dimension === sizesEnum.small ? 40 : 72;
  const sizeFont = dimension === sizesEnum.small ? 16 : 22;
  const iconSize = dimension === sizesEnum.small ? 22 : 38;

  return (
    <>
      {user && user.avatarUrl ? (
        <Image
          source={{ uri: user.avatarUrl }}
          style={[
            styles.avatarImg,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <LinearGradient
          colors={colorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.avatar, { width: size, height: size }]}
        >
          {initial ? (
            <Text style={[styles.avatarText, { fontSize: sizeFont }]}>
              {initial}
            </Text>
          ) : (
            <Ionicons name="person" size={iconSize} color="rgba(255,255,255,0.9)" />
          )}
        </LinearGradient>
      )}
    </>
  );
}
