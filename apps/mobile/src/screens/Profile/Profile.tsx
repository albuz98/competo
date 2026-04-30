import React, { useCallback, useState, useEffect, useRef } from "react";
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
import ProfilePlayer, { PlayerFormRef } from "./ProfilePlayer/ProfilePlayer";
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
    first_name: "",
    last_name: "",
    username: "",
    location: "",
    birthdate: "",
    gender: null as Gender | null,
    password: "",
    confirmPassword: "",
    orgName: "",
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, NavigationEnum.PROFILE>>();
  const insets = useSafeAreaInsets();
  const [changeProfileModal, setChangeProfileModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isOrganizerProfile = currentProfile?.role === UserRole.ORGANIZER;
  const mounted = useRef(false);
  const playerFormRef = useRef<PlayerFormRef>({
    first_name: "",
    last_name: "",
    username: "",
    location: "",
    birthdate: "",
    email: "",
    emailVerified: false,
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
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
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      username: user?.username ?? "",
      location: user?.location ?? "",
      birthdate: user?.birthdate ?? "",
      gender: user?.gender ?? null,
      password: "",
      confirmPassword: "",
      orgName: orgProfile?.orgName ?? "",
    });
    setIsDirty(false);
    setEdit(true);
  };

  const handleDiscard = () => {
    const doDiscard = () => {
      setEdit(false);
      setIsDirty(false);
      navigation.navigate(NavigationEnum.SETTINGS);
    };
    if (isDirty) {
      Alert.alert(
        "Modifiche non salvate",
        "Sei sicuro di voler tornare indietro senza salvare?",
        [
          { text: "Annulla", style: "cancel" },
          { text: "Sì", style: "destructive", onPress: doDiscard },
        ],
      );
    } else {
      doDiscard();
    }
  };

  const handleSave = async () => {
    if (
      currentProfile?.role === UserRole.ORGANIZER &&
      form.orgName !== currentProfile.orgName
    ) {
      updateOrgProfileData(currentProfile.id, { orgName: form.orgName });
    }

    if (currentProfile?.role !== UserRole.ORGANIZER) {
      const pf = playerFormRef.current;
      const emailChanged = pf.email !== (user?.email ?? "");

      if (emailChanged && !pf.emailVerified) {
        Alert.alert(
          "Email non verificata",
          "L'email non verrà aggiornata perché non è stata verificata. Le altre modifiche verranno salvate.",
          [{ text: "OK" }],
        );
      }

      const hasChanges =
        pf.first_name !== (user?.first_name ?? "") ||
        pf.last_name !== (user?.last_name ?? "") ||
        pf.username !== (user?.username ?? "") ||
        pf.location !== (user?.location ?? "") ||
        pf.birthdate !== (user?.birthdate ?? "") ||
        form.gender !== (user?.gender ?? null) ||
        (emailChanged && pf.emailVerified);

      if (hasChanges) {
        if (pf.location && pf.location !== (user?.location ?? "")) {
          const results = await Location.geocodeAsync(pf.location);
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
          first_name: pf.first_name,
          last_name: pf.last_name,
          username: pf.username,
          location: pf.location,
          birthdate: pf.birthdate,
          gender: form.gender ?? undefined,
          ...(emailChanged && pf.emailVerified ? { email: pf.email } : {}),
        });
        setSaving(false);
      }
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
          handleDiscard={handleDiscard}
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
              onDirty={() => setIsDirty(true)}
            />
          ) : (
            <ProfilePlayer
              currentProfile={currentProfile}
              saving={saving}
              edit={edit}
              gender={form.gender}
              onGenderChange={(g) => {
                setForm((f) => ({ ...f, gender: g }));
                setIsDirty(true);
              }}
              onDirty={() => setIsDirty(true)}
              formRef={playerFormRef}
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
