import React, { useRef, useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useTeams } from "../../../context/TeamsContext";
import { Gender, ViewModeProfile } from "../../../types/user";
import { HeaderCardProfile } from "../../../components/HeaderCardProfile/HeaderCard";
import { styles } from "../Profile.styles";
import { Switcher } from "../../../components/core/Switcher/Switcher";
import { CoachView } from "./SubComponents/CoachView";
import { PlayerView } from "./SubComponents/PlayerView";
import { EditProfile } from "./SubComponents/EditProfile";

export interface PlayerFormRef {
  first_name: string;
  last_name: string;
  username: string;
  location: string;
  birthdate: string;
  email: string;
  emailVerified: boolean;
}

interface ProfilePlayerProps {
  saving: boolean;
  edit: boolean;
  gender: Gender | null;
  onGenderChange: (g: Gender) => void;
  onDirty?: () => void;
  formRef?: React.MutableRefObject<PlayerFormRef>;
}

export default function ProfilePlayer({
  saving,
  edit,
  gender,
  onGenderChange,
  onDirty,
  formRef,
}: ProfilePlayerProps) {
  const { user, updateProfile } = useAuth();
  const { refreshTeams } = useTeams();
  const [viewMode, setViewMode] = useState<ViewModeProfile>(
    ViewModeProfile.PLAYER,
  );

  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const savedScrollY = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const y = savedScrollY.current;
      if (y > 0) {
        setTimeout(
          () => scrollRef.current?.scrollTo({ y, animated: false }),
          50,
        );
      }
      if (user) refreshTeams();
    }, [user?.id]),
  );

  if (!user) {
    return (
      <View style={styles.root}>
        <Text style={styles.header}>Errore nella generazione del profilo</Text>
      </View>
    );
  }

  const VIEW_MODE_OPTIONS = [
    { label: "Allenatore", value: ViewModeProfile.COACH },
    { label: "Giocatore", value: ViewModeProfile.PLAYER },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 90 },
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(e) => {
          savedScrollY.current = e.nativeEvent.contentOffset.y;
        }}
      >
        <HeaderCardProfile
          user={user}
          subtitle={user.location}
          birthdate={user.birthdate}
          gender={user.gender}
          saving={saving}
          edit={edit}
          updateProfile={updateProfile}
          extraBottom={
            !edit ? (
              <Switcher
                options={VIEW_MODE_OPTIONS}
                value={viewMode}
                onChange={setViewMode}
              />
            ) : undefined
          }
        >
          <EditProfile
            edit={edit}
            formRef={formRef}
            gender={gender}
            onGenderChange={onGenderChange}
            onDirty={onDirty}
          />
        </HeaderCardProfile>

        {/* ── PLAYER VIEW ─────────────────────────────── */}
        {viewMode === "player" && !edit && <PlayerView />}

        {/* ── COACH VIEW ──────────────────────────────── */}
        {viewMode === "coach" && !edit && <CoachView />}
      </ScrollView>
    </View>
  );
}
