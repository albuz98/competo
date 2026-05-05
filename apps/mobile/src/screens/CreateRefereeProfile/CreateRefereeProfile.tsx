import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { type RootStackParamList, NavigationEnum } from "../../types/navigation";
import { colors } from "../../theme/colors";
import { ButtonBack } from "../../components/core/Button/Button";
import { Popup } from "../../components/core/Popup/Popup";
import { s } from "./CreateRefereeProfile.styles";

const REFEREE_CATEGORIES = [
  "Serie A / Serie B",
  "Lega Pro",
  "Serie D",
  "Eccellenza",
  "Promozione",
  "Prima Categoria",
  "Seconda Categoria",
  "Terza Categoria",
  "Giovanili / Juniores",
];

type Props = NativeStackScreenProps<RootStackParamList, "CreateRefereeProfile">;

export default function CreateRefereeProfile({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [aiaNumber, setAiaNumber] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    aiaNumber.trim().length > 0 &&
    category !== null;

  async function handleSubmit() {
    if (!isValid) {
      Alert.alert("Dati mancanti", "Compila tutti i campi prima di procedere.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSuccessPopup(true);
  }

  return (
    <>
      <SafeAreaView style={s.root} edges={["top"]}>
        <View style={s.header}>
          <ButtonBack handleBtn={() => navigation.goBack()} isArrowBack />
          <Text style={s.headerTitle}>Registrazione arbitro</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.heroBox}>
            <View style={s.heroIconWrap}>
              <Ionicons
                name="ribbon-outline"
                size={26}
                color={colors.purpleBlue}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.heroTitle}>Sei un arbitro AIA?</Text>
              <Text style={s.heroSub}>
                Inserisci i tuoi dati per richiedere la verifica del profilo
                arbitro su Competo.
              </Text>
            </View>
          </View>

          <Text style={s.sectionLabel}>Dati personali</Text>

          <Pressable
            onPress={() => {}}
            style={[s.inputWrap, focusedField === "firstName" && s.inputFocused]}
          >
            <Text style={s.inputLabel}>Nome</Text>
            <TextInput
              style={s.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Es. Marco"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={[s.inputWrap, focusedField === "lastName" && s.inputFocused]}
          >
            <Text style={s.inputLabel}>Cognome</Text>
            <TextInput
              style={s.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Es. Rossi"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />
          </Pressable>

          <Text style={s.sectionLabel}>Dati AIA</Text>

          <Pressable
            onPress={() => {}}
            style={[s.inputWrap, focusedField === "aiaNumber" && s.inputFocused]}
          >
            <Text style={s.inputLabel}>Numero identificativo AIA</Text>
            <TextInput
              style={s.input}
              value={aiaNumber}
              onChangeText={setAiaNumber}
              placeholder="Es. 123456"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("aiaNumber")}
              onBlur={() => setFocusedField(null)}
              keyboardType="number-pad"
            />
          </Pressable>

          <Text style={s.sectionLabel}>Categoria</Text>

          <View style={s.chipsRow}>
            {REFEREE_CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[s.chip, category === cat && s.chipSelected]}
                onPress={() => setCategory(cat === category ? null : cat)}
              >
                <Text
                  style={[
                    s.chipText,
                    category === cat && s.chipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={s.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.darkBlue}
            />
            <Text style={s.infoBoxText}>
              I tuoi dati verranno verificati con il registro AIA. Riceverai una
              notifica entro 24–48 ore con l'esito della revisione.
            </Text>
          </View>

          <Pressable
            style={[s.submitBtn, !isValid && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={s.submitBtnText}>Invia richiesta</Text>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>

      <Popup
        visible={successPopup}
        onClose={() => {
          setSuccessPopup(false);
          navigation.replace(NavigationEnum.MAIN_TABS);
        }}
        title="Richiesta inviata!"
        message="Il tuo profilo arbitro è in fase di revisione. Riceverai una notifica entro 24–48 ore con l'esito della verifica."
        variant="warning"
        icon="time-outline"
      />
    </>
  );
}
