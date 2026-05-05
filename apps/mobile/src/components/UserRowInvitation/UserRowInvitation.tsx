import { View, Text } from "react-native";
import { Avatar } from "../core/Avatar/Avatar";
import { ButtonFullColored } from "../core/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { AppUser } from "../../types/team";
import { Ionicons } from "@expo/vector-icons";
import { ip } from "./UserRowInvitation.styled";
import { colors } from "../../theme/colors";

interface UseRowInvitationProps {
  user: AppUser;
  alreadyMember: boolean;
  invited: boolean;
  onInvite: () => void;
}

export function UserRowInvitation({
  user,
  alreadyMember,
  invited,
  onInvite,
}: UseRowInvitationProps) {
  return (
    <View style={ip.userRow}>
      <View style={ip.userAvatar}>
        <Avatar user={user} dimension={sizesEnum.small} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ip.userName}>
          {user.firstName || user.lastName
            ? `${user.firstName} ${user.lastName}`
            : `@${user.username}`}
        </Text>
        <Text style={ip.userUsername}>@{user.username}</Text>
      </View>
      {alreadyMember ? (
        <View style={ip.alreadyBadge}>
          <Text style={ip.alreadyBadgeText}>Già membro</Text>
        </View>
      ) : invited ? (
        <View style={ip.invitedBadge}>
          <Ionicons name="checkmark" size={14} color={colors.success} />
          <Text style={ip.invitedBadgeText}>In attesa</Text>
        </View>
      ) : (
        <ButtonFullColored
          text="Invita"
          handleBtn={onInvite}
          isColored
          size={sizesEnum.small}
        />
      )}
    </View>
  );
}
