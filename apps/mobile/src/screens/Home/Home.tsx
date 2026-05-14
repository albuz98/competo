import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types/user";
import HomePlayer from "./HomePlayer/HomePlayer";
import { HomeOrganizer } from "./HomeOrganizer/HomeOrganizer";

export default function Home() {
  const { currentProfile } = useAuth();

  const isPlayer = !currentProfile || currentProfile.role === UserRole.PLAYER;
  const isOrganizer =
    currentProfile && currentProfile.role === UserRole.ORGANIZER;

  return (
    <>
      {isPlayer ? <HomePlayer /> : null}
      {isOrganizer ? <HomeOrganizer /> : null}
    </>
  );
}
