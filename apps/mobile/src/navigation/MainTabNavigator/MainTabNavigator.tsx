import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/user";
import { PlayerTabs } from "./TabsForRole/PlayerTabs";
import { OrganizerTabs } from "./TabsForRole/OrganizerTabs.";

export default function MainTabNavigator() {
  const { currentProfile } = useAuth();

  const isPlayer = !currentProfile || currentProfile.role === UserRole.PLAYER;
  const isOrganizer =
    currentProfile && currentProfile.role === UserRole.ORGANIZER;

  return (
    <>
      {isPlayer ? <PlayerTabs /> : null}
      {isOrganizer ? <OrganizerTabs /> : null}
    </>
  );
}
