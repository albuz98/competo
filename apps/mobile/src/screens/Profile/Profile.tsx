import React, { useCallback, useState, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import {
  Text,
  Alert,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../context/TeamsContext";
import {
  RootStackParamList,
  MainTabParamList,
  NavigationEnum,
} from "../../types/navigation";
import { styles } from "./Profile.styles";
import { styles as tabStyles } from "../../navigation/MainTabNavigator/MainTabNavigator.styles";
import { Gender, UserRole } from "../../types/user";
import { TopBarProfile } from "../../components/TopBarProfile/TopBarProfile";
import ProfileOrganizer from "./ProfileOrganizer/ProfileOrganizer";
import ProfilePlayer from "./ProfilePlayer/ProfilePlayer";
import { ModalSwitchProfile } from "../../components/ModalSwitchProfile/ModalSwitchProfile";

export default function Profile() {
  const {
    user,
    currentProfile,
    updateProfile,
    switchProfile,
    updateOrgProfileData,
  } = useAuth();
  const { refreshTeams } = useTeams();
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    location: "",
    dateOfBirth: "",
    gender: Gender.OTHER,
    password: "",
    confirmPassword: "",
    orgName: "",
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, NavigationEnum.PROFILE>>();
  const insets = useSafeAreaInsets();
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const isOrganizerProfile = currentProfile?.role === UserRole.ORGANIZER;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).setOptions({
      tabBarStyle: edit
        ? { display: "none" }
        : [tabStyles.tabBar, { bottom: insets.bottom + 8 }],
    });
  }, [edit]);

  useFocusEffect(
    useCallback(() => {
      setEdit(false);
      if (user) refreshTeams();
    }, [user?.id]),
  );

  useEffect(() => {
    if (route.params?.startEdit) {
      handleStartEdit();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigation as any).setParams({ startEdit: undefined });
    }
  }, [route.params?.startEdit]);

  const handleStartEdit = () => {
    const orgProfile =
      currentProfile?.role === UserRole.ORGANIZER ? currentProfile : null;
    if (orgProfile?.pendingApproval) {
      Alert.alert(
        "Profilo in revisione",
        "Non puoi modificare il profilo organizzatore fino all'approvazione da parte del team Competo.",
      );
      return;
    }
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      location: user?.location ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      gender: user?.gender ?? Gender.OTHER,
      password: "",
      confirmPassword: "",
      orgName: orgProfile?.orgName ?? "",
    });
    setEdit(true);
  };

  const handleSave = async () => {
    // Salva campi organizzatore
    if (
      currentProfile?.role === UserRole.ORGANIZER &&
      form.orgName !== currentProfile.orgName
    ) {
      updateOrgProfileData(currentProfile.id, { orgName: form.orgName });
    }

    const hasChanges =
      form.firstName !== (user?.firstName ?? "") ||
      form.lastName !== (user?.lastName ?? "") ||
      form.username !== (user?.username ?? "") ||
      form.location !== (user?.location ?? "") ||
      form.dateOfBirth !== (user?.dateOfBirth ?? "") ||
      form.gender !== (user?.gender ?? "");

    if (hasChanges) {
      if (form.location && form.location !== (user?.location ?? "")) {
        const results = await Location.geocodeAsync(form.location);
        if (results.length === 0) {
          Alert.alert(
            "Posizione non valida",
            "Inserisci una città o un indirizzo esistente.",
          );
          return;
        }
      }
      setSaving(true);
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        location: form.location,
        gender: (form.gender as Gender) || undefined,
      });
      setSaving(false);
    }
    setEdit(false);
    navigation.navigate(NavigationEnum.SETTINGS);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <Text style={styles.header}>Errore nella generazione del profilo</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.root} edges={["top"]}>
        <TopBarProfile
          handleSave={handleSave}
          setChangeProfileModal={setChangeProfileModal}
          edit={edit}
          currentProfile={currentProfile}
          navigation={navigation}
        />
        <View style={{ flex: 1 }}>
          {isOrganizerProfile ? (
            <ProfileOrganizer
              currentProfile={currentProfile}
              saving={saving}
              edit={edit}
              setEdit={setEdit}
            />
          ) : (
            <ProfilePlayer
              currentProfile={currentProfile}
              saving={saving}
              edit={edit}
              gender={form.gender}
              onGenderChange={(g) => setForm((f) => ({ ...f, gender: g }))}
            />
          )}
        </View>
        <ModalSwitchProfile
          changeProfileModal={changeProfileModal}
          setChangeProfileModal={setChangeProfileModal}
          switchProfile={switchProfile}
          currentProfile={currentProfile}
          user={user}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
