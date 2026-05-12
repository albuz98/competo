import React from "react";
import { View, Text } from "react-native";
import { MemberRow } from "../../../components/MemberRow/MemberRow";
import { tds } from "../TeamDetail.styles";
import type { TeamMemberResponse } from "../../../types/team";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamInvitations } from "../../../api/teams";
import { queryKeys } from "../../../lib/queryKeys";
import { useAuth } from "../../../context/AuthContext";
import { TeamRole } from "../../../constants/team";

interface MembersProps {
  isRep: boolean;
  editMode: boolean;
  setConfirmTarget: (m: TeamMemberResponse) => void;
  setRoleTarget: (m: TeamMemberResponse) => void;
  setJerseyTarget: (m: TeamMemberResponse) => void;
  setJerseyInput: (s: string) => void;
  teamId: number;
  members: TeamMemberResponse[];
}

export const Members = ({
  isRep,
  editMode,
  setConfirmTarget,
  setRoleTarget,
  setJerseyTarget,
  setJerseyInput,
  teamId,
  members,
}: MembersProps) => {
  const { user } = useAuth();

  const { data: teamInvitations = [] } = useQuery({
    queryKey: queryKeys.teamInvitations(teamId),
    queryFn: () => fetchTeamInvitations(teamId, user!.token),
    enabled: !!user && isRep,
  });

  const sortedMembers = [...members].sort(
    (a: TeamMemberResponse, b: TeamMemberResponse) =>
      a.role === "representative" ? -1 : b.role === "representative" ? 1 : 0,
  );
  const coaches = sortedMembers.filter((m) => m.role === TeamRole.COACH);
  const nonCoaches = sortedMembers.filter((m) => m.role !== TeamRole.COACH);

  return (
    <>
      {coaches.length > 0 && (
        <View style={tds.section}>
          <Text style={tds.sectionTitle}>Allenatore</Text>
          {coaches.map((m: TeamMemberResponse) => (
            <MemberRow
              key={m.id}
              member={m}
              currentUserIsRep={isRep}
              editMode={editMode}
              onRemove={() => setConfirmTarget(m)}
              onChangeRole={() => setRoleTarget(m)}
              onEditJersey={() => {
                setJerseyTarget(m);
                setJerseyInput(
                  m.jerseyNumber != null ? String(m.jerseyNumber) : "",
                );
              }}
            />
          ))}
        </View>
      )}
      <View style={[tds.section, { marginTop: 12 }]}>
        <Text style={tds.sectionTitle}>Giocatori</Text>
        {nonCoaches.map((m: TeamMemberResponse) => (
          <MemberRow
            key={m.id}
            member={m}
            currentUserIsRep={isRep}
            editMode={editMode}
            onRemove={() => setConfirmTarget(m)}
            onChangeRole={() => setRoleTarget(m)}
            onEditJersey={() => {
              setJerseyTarget(m);
              setJerseyInput(
                m.jerseyNumber != null ? String(m.jerseyNumber) : "",
              );
            }}
          />
        ))}
      </View>

      {!editMode && isRep && teamInvitations.length > 0 && (
        <View style={[tds.section, { marginTop: 12 }]}>
          <Text style={tds.sectionTitle}>INVITI</Text>
          {teamInvitations.map((invite) => {
            const name =
              invite.firstName && invite.lastName
                ? `${invite.firstName} ${invite.lastName}`
                : (invite.username ?? `#${invite.invited_user_id}`);
            const ini = name.slice(0, 2).toUpperCase();
            const badgeStyle =
              invite.status === "accepted"
                ? tds.inviteBadgeAccepted
                : invite.status === "declined"
                  ? tds.inviteBadgeDeclined
                  : tds.pendingBadge;
            const badgeTextStyle =
              invite.status === "accepted"
                ? tds.inviteBadgeTextAccepted
                : invite.status === "declined"
                  ? tds.inviteBadgeTextDeclined
                  : tds.pendingBadgeText;
            const badgeLabel =
              invite.status === "accepted"
                ? "Accettato"
                : invite.status === "declined"
                  ? "Rifiutato"
                  : "In attesa";
            return (
              <View key={invite.id} style={tds.pendingInviteRow}>
                <View style={tds.pendingInviteAvatar}>
                  <Text style={tds.pendingInviteAvatarText}>{ini}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={tds.pendingInviteName}>{name}</Text>
                </View>
                <View style={badgeStyle}>
                  <Text style={badgeTextStyle}>{badgeLabel}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};
