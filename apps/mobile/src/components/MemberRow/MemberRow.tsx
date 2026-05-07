import { View, Text } from "react-native";
import { HAS_JERSEY, ROLE_LABEL, TeamMemberResponse } from "../../types/team";
import { LinearGradient } from "expo-linear-gradient";
import { colorGradient, colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { ButtonGeneric, ButtonIcon } from "../core/Button/Button";
import { tds } from "./MemberRow.styled";

export function MemberRow({
  member,
  currentUserIsRep,
  editMode = false,
  onRemove,
  onChangeRole,
  onEditJersey,
}: {
  member: TeamMemberResponse;
  currentUserIsRep: boolean;
  editMode?: boolean;
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
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 6,
            marginTop: 2,
          }}
        >
          <Text style={tds.memberUsername}>@{member.username}</Text>
          {(() => {
            const displayRole = isRep ? member.gameRole : member.role;
            if (!displayRole) return null;
            return editMode && currentUserIsRep ? (
              <ButtonGeneric
                handleBtn={onChangeRole}
                style={tds.rolePillEditable}
              >
                <Text style={tds.rolePillEditableText}>
                  {ROLE_LABEL[displayRole] ?? displayRole}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={10}
                  color={colors.primary}
                />
              </ButtonGeneric>
            ) : (
              <View style={tds.rolePillStatic}>
                <Text style={tds.rolePillText}>
                  {ROLE_LABEL[displayRole] ?? displayRole}
                </Text>
              </View>
            );
          })()}
        </View>
      </View>

      {/* Jersey — editable in edit mode, read-only otherwise */}
      {showJersey &&
        (editMode && currentUserIsRep ? (
          <ButtonGeneric
            handleBtn={onEditJersey}
            style={[tds.jerseyBadge, tds.jerseyBadgeEditable]}
          >
            {member.jerseyNumber != null ? (
              <Text style={[tds.jerseyText, tds.jerseyTextEditable]}>
                #{member.jerseyNumber}
              </Text>
            ) : (
              <Text style={tds.jerseyEmpty}>+</Text>
            )}
          </ButtonGeneric>
        ) : member.jerseyNumber != null ? (
          <View style={tds.jerseyBadge}>
            <Text style={tds.jerseyText}>#{member.jerseyNumber}</Text>
          </View>
        ) : null)}

      {/* Remove — only in edit mode */}
      {currentUserIsRep && !isRep && editMode ? (
        <ButtonIcon
          handleBtn={onRemove}
          icon={
            <Ionicons
              name="person-remove-outline"
              size={18}
              color={colors.danger}
            />
          }
        />
      ) : null}
    </View>
  );
}
