import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
import { RootStackParamList } from "../../types";
import { useTeams } from "../../context/TeamsContext";
import { ButtonEnum } from "../../types/components";
import { cs } from "./CreateTeam.styles";
import { GAMES } from "../../mock/data";
import {
  ButtonBorderColored,
  ButtonFullColored,
  ButtonIcon,
} from "../../components/Button/Button";
import { sizesEnum } from "../../theme/dimension";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "CreateTeam">;

export default function CreateTeam({ navigation }: Props) {
  const { createTeam } = useTeams();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const isValid = name.trim().length >= 2 && sport.length > 0;

  const handleCreate = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const team = await createTeam(name.trim(), sport);
      navigation.replace("TeamDetail", { teamId: team.id });
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Errore nella creazione");
      setError("Errore nella creazione della squadra. Riprova.");
      setLoading(false);
    }
  };

  return (
    <View style={cs.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={cs.header}>
            <ButtonIcon
              handleBtn={() => navigation.goBack()}
              icon={<Ionicons name="chevron-back" size={24} color="#1e293b" />}
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
                color="#E8601A"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={cs.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setCreateError(null);
                }}
                placeholder="Es. Roma Eagles FC"
                placeholderTextColor="#94a3b8"
                autoFocus
                returnKeyType="done"
                maxLength={40}
              />
            </View>
            <Text style={cs.inputHint}>Minimo 2 caratteri</Text>
            {createError && (
              <Text
                style={{
                  color: "#ef4444",
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
              {GAMES.map((g) => (
                <ButtonBorderColored
                  key={g}
                  handleBtn={() => setSport(g)}
                  text={g}
                  isColored
                  size={sizesEnum.medium}
                  isActive={sport === g}
                />
              ))}
            </ScrollView>

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
                color="#E8601A"
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
                    !(!isValid || loading) ? "#fff" : colors.primaryGradientMid
                  }
                />
              }
              handleBtn={handleCreate}
              isDisabled={!isValid || loading}
              loading={loading}
              loaderColor="#fff"
              isColored
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
