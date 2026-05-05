import React from "react";
import { View, Text, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { ButtonBack } from "../../components/core/Button/Button";
import { styles } from "./Settings.styles";
import { UserRole } from "../../types/user";

export default function Settings() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();

  const isAlreadyOrganizer = user?.profiles?.some(
    (p) => p.role === UserRole.ORGANIZER,
  );

  const handleRefereeProfile = () => {
    navigation.navigate(NavigationEnum.CREATE_REFEREE_PROFILE);
  };

  const handleEditProfile = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).navigate(NavigationEnum.MAIN_TABS, {
      screen: NavigationEnum.PROFILE,
      params: { startEdit: true },
    });
  };

  const handleTwoFactor = () => {
    navigation.navigate(NavigationEnum.TWO_FACTOR_AUTH);
  };

  const handleLogout = () => {
    logout();
    navigation.reset({ index: 0, routes: [{ name: "ChoseAccess" }] });
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <ButtonBack
          handleBtn={() =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigation as any).navigate(NavigationEnum.MAIN_TABS, {
              screen: NavigationEnum.PROFILE,
            })
          }
          isArrowBack={false}
        />
        <Text style={styles.headerTitle}>Impostazioni</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={handleEditProfile}>
            <View
              style={[
                styles.rowIcon,
                { backgroundColor: colors.primarySelectedBg },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.rowText}>Modifica profilo</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.grayDark}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={handleTwoFactor}>
            <View
              style={[styles.rowIcon, { backgroundColor: colors.purpleBlueBg }]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.purpleBlue}
              />
            </View>
            <Text style={styles.rowText}>Autenticazione a due fattori</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.grayDark}
            />
          </Pressable>

          {!isAlreadyOrganizer && (
            <>
              <View style={styles.divider} />
              <Pressable
                style={styles.row}
                onPress={() =>
                  navigation.navigate(NavigationEnum.CREATE_ORGANIZER_PROFILE)
                }
              >
                <View
                  style={[styles.rowIcon, { backgroundColor: colors.infoBg }]}
                >
                  <Ionicons
                    name="trophy-outline"
                    size={20}
                    color={colors.infoText}
                  />
                </View>
                <Text style={styles.rowText}>Vuoi organizzare un torneo?</Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.grayDark}
                />
              </Pressable>
            </>
          )}

          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={handleRefereeProfile}>
            <View
              style={[styles.rowIcon, { backgroundColor: colors.purpleBlueBg }]}
            >
              <Ionicons
                name="ribbon-outline"
                size={20}
                color={colors.purpleBlue}
              />
            </View>
            <Text style={styles.rowText}>Sei un arbitro?</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.grayDark}
            />
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <View style={[styles.card, styles.cardDanger]}>
          <Pressable style={styles.row} onPress={handleLogout}>
            <View
              style={[styles.rowIcon, { backgroundColor: colors.dangerBg }]}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.danger}
              />
            </View>
            <Text style={[styles.rowText, styles.rowTextDanger]}>Logout</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.grayDark}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
