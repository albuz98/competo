import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigationEnum, RootStackParamList } from "../../types/navigation";
import { useTeams } from "../../context/TeamsContext";
import { cs } from "./CreateTeam.styles";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonIcon,
} from "../../components/core/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { colors } from "../../theme/colors";
import { TEAM_FORMAT_OPTIONS, TeamFormat } from "../../constants/generals";
import { TeamRole } from "../../constants/team";

type Props = NativeStackScreenProps<RootStackParamList, "CreateTeam">;

export default function CreateTeam({ navigation }: Props) {
  const { createTeam } = useTeams();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [format, setFormat] = useState<TeamFormat | null>(null);
  const [representativeRole, setRepresentativeRole] = useState<TeamRole.PLAYER | TeamRole.COACH | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const isValid = name.trim().length >= 2 && format !== null && representativeRole !== null;

  const handleCreate = async () => {
    if (!isValid || loading || format === null || representativeRole === null) return;
    setLoading(true);
    setError(null);
    try {
      const team = await createTeam(name.trim(), format, representativeRole);
      navigation.replace(NavigationEnum.TEAM_DETAIL, { teamId: team.id });
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Errore nella creazione");
      setError("Errore nella creazione della squadra. Riprova.");
      setLoading(false);
    }
  };

  return (
    <View style={cs.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={cs.header}>
            <ButtonIcon
              handleBtn={() => navigation.goBack()}
              icon={
                <Ionicons name="chevron-back" size={24} color={colors.dark} />
              }
              style={cs.backBtn}
            />
            <Text style={cs.headerTitle}>Crea squadra</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            contentContainerStyle={[
              cs.content,
              { paddingBottom: insets.bottom + 32 },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name input */}
            <Text style={cs.label}>NOME SQUADRA</Text>
            <View
              style={[cs.inputWrap, name.length > 0 && cs.inputWrapFocused]}
            >
              <Ionicons
                name="shield-outline"
                size={18}
                color={colors.primaryGradientMid}
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={cs.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setCreateError(null);
                }}
                placeholder="Nome squadra"
                placeholderTextColor={colors.grayDark}
                autoFocus
                returnKeyType="done"
                maxLength={40}
              />
            </View>
            <Text style={cs.inputHint}>Minimo 2 caratteri</Text>
            {createError && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 13,
                  marginTop: -8,
                  marginBottom: 8,
                  paddingHorizontal: 4,
                }}
              >
                {createError}
              </Text>
            )}

            {/* Sport selector */}
            <Text style={[cs.label, { marginTop: 24 }]}>SPORT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={cs.sportsList}
            >
              {TEAM_FORMAT_OPTIONS.map((opt) => (
                <ButtonBorderColored
                  key={opt.format}
                  handleBtn={() => setFormat(opt.format)}
                  text={opt.label}
                  isColored
                  size={sizesEnum.medium}
                  isActive={format === opt.format}
                />
              ))}
            </ScrollView>

            {/* Role selector */}
            <Text style={[cs.label, { marginTop: 24 }]}>IL TUO RUOLO</Text>
            <View style={cs.roleRow}>
              <TouchableOpacity
                style={[cs.roleCard, representativeRole === TeamRole.PLAYER && cs.roleCardActive]}
                onPress={() => setRepresentativeRole(TeamRole.PLAYER)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="football-outline"
                  size={28}
                  color={representativeRole === TeamRole.PLAYER ? colors.primary : colors.grayDark}
                />
                <Text style={[cs.roleCardLabel, representativeRole === TeamRole.PLAYER && cs.roleCardLabelActive]}>
                  Giocatore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[cs.roleCard, representativeRole === TeamRole.COACH && cs.roleCardActive]}
                onPress={() => setRepresentativeRole(TeamRole.COACH)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="stopwatch-outline"
                  size={28}
                  color={representativeRole === TeamRole.COACH ? colors.primary : colors.grayDark}
                />
                <Text style={[cs.roleCardLabel, representativeRole === TeamRole.COACH && cs.roleCardLabelActive]}>
                  Allenatore
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={cs.errorBox}>
                <Text style={cs.errorText}>{error}</Text>
              </View>
            )}

            {/* Info card */}
            <View style={cs.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.primaryGradientMid}
              />
              <Text style={cs.infoText}>
                Creando la squadra diventerai automaticamente il rappresentante
                e potrai invitare altri giocatori.
              </Text>
            </View>

            {/* CTA */}
            <ButtonFullColored
              text="Crea squadra"
              iconLeft={
                <Ionicons
                  name="people"
                  size={18}
                  color={
                    !(!isValid || loading)
                      ? colors.white
                      : colors.primaryGradientMid
                  }
                />
              }
              handleBtn={handleCreate}
              isDisabled={!isValid || loading}
              loading={loading}
              loaderColor={colors.white}
              isColored
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
