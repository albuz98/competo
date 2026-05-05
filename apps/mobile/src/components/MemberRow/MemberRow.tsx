import { View, Text } from "react-native";
import { HAS_JERSEY, ROLE_LABEL, TeamMemberResponse } from "../../types/team";
import { LinearGradient } from "expo-linear-gradient";
import { colorGradient, colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  ButtonBorderColored,
  ButtonGeneric,
  ButtonIcon,
} from "../core/Button/Button";
import { tds } from "./MemberRow.styled";

export function MemberRow({
  member,
  currentUserIsRep,
  onRemove,
  onChangeRole,
  onEditJersey,
}: {
  member: TeamMemberResponse;
  currentUserIsRep: boolean;
  onRemove: () => void;
  onChangeRole: () => void;
  onEditJersey: () => void;
}) {
  const initials =
    (member.firstName ? member.firstName[0] : "") +
    (member.lastName ? member.lastName[0] : "");
  const isRep = member.role === "representative";
  const showJersey = HAS_JERSEY[member.role] === true;

  return (
    <View style={[tds.memberRow, isRep && tds.memberRowRep]}>
      <View style={[tds.memberAvatar, isRep && tds.memberAvatarRep]}>
        {isRep ? (
          <LinearGradient colors={colorGradient} style={tds.memberAvatarInner}>
            <Text style={tds.memberAvatarText}>{initials.toUpperCase()}</Text>
          </LinearGradient>
        ) : (
          <View
            style={[tds.memberAvatarInner, { backgroundColor: colors.gray }]}
          >
            <Text style={[tds.memberAvatarText, { color: colors.placeholder }]}>
              {initials.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={tds.memberNameRow}>
          <Text style={tds.memberName}>
            {member.firstName} {member.lastName}
          </Text>
          {isRep && (
            <View style={tds.crownBadge}>
              <Ionicons
                name="star"
                size={10}
                color={colors.primaryGradientMid}
              />
              <Text style={tds.crownText}>Cap.</Text>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          <Text style={tds.memberUsername}>@{member.username}</Text>
          {!isRep &&
            (currentUserIsRep ? (
              <ButtonBorderColored
                handleBtn={onChangeRole}
                iconRight={
                  <Ionicons
                    name="chevron-down"
                    size={10}
                    color={colors.placeholder}
                  />
                }
                text={ROLE_LABEL[member.role] ?? member.role}
              />
            ) : (
              <View style={tds.rolePillStatic}>
                <Text style={tds.rolePillText}>
                  {ROLE_LABEL[member.role] ?? member.role}
                </Text>
              </View>
            ))}
        </View>
      </View>
      {/* Jersey number — solo calciatore/portiere */}
      {showJersey && (
        <ButtonGeneric
          handleBtn={currentUserIsRep ? onEditJersey : () => {}}
          style={[tds.jerseyBadge, currentUserIsRep && tds.jerseyBadgeEditable]}
        >
          {member.jerseyNumber != null ? (
            <Text
              style={[
                tds.jerseyText,
                currentUserIsRep && tds.jerseyTextEditable,
              ]}
            >
              #{member.jerseyNumber}
            </Text>
          ) : (
            <Text style={tds.jerseyEmpty}>+</Text>
          )}
        </ButtonGeneric>
      )}
      {currentUserIsRep && !isRep ? (
        <ButtonIcon
          handleBtn={onRemove}
          icon={
            <Ionicons
              name="person-remove-outline"
              size={18}
              color={colors.primary}
            />
          }
        />
      ) : null}
    </View>
  );
}
