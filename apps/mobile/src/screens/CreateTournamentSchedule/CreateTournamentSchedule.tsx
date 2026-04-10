import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
  RootStackParamList,
  TournamentFormat,
  TournamentPhaseKind,
  CreateTournamentPayload,
  TournametNumberPartecipants,
} from "../../types";
import { createTournament } from "../../api/tournaments";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { s } from "./CreateTournamentSchedule.styles";
import {
  ButtonBorderColored,
  ButtonGradient,
} from "../../components/Button/Button";
import { renderStep1 } from "./steps/step1";
import { renderStep2 } from "./steps/step2";
import { renderStep3 } from "./steps/step3";
import { estimateTotalMatches } from "../../functions/tournamet";
import { renderStep4 } from "./steps/step4";
import { renderStep5 } from "./steps/step5";
import { STEP_TITLES } from "../../constants/formatTournament";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "CreateTournamentSchedule"
>;

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function CreateTournamentSchedule({ navigation }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [generating, setGenerating] = useState(false);

  // Step 1: Tournament info
  const [tournamentName, setTournamentName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | undefined>(undefined);
  const [locationLng, setLocationLng] = useState<number | undefined>(undefined);

  // Step 2: Structure (chosen first)
  const [phaseKind, setPhaseKind] = useState<TournamentPhaseKind>("single");
  const [format, setFormat] = useState<TournamentFormat>("round-robin");
  const [knockoutFormat, setKnockoutFormat] =
    useState<TournamentFormat>("knockout");

  // Step 3: Participants (informed by structure)
  const [numTeams, setNumTeams] = useState(8);
  const [numGroups, setNumGroups] = useState(2);

  // Derived: effective groups capped by teams
  const maxGroups = Math.max(2, Math.floor(numTeams / 2));
  const effGroups = phaseKind === "multi" ? Math.min(numGroups, maxGroups) : 1;

  // Step 4: Logistics
  const [numFields, setNumFields] = useState(2);
  const [matchDuration, setMatchDuration] = useState(45);
  const [restMinutes, setRestMinutes] = useState(15);
  const [travelMinutes, setTravelMinutes] = useState(10);

  // Step 5: Calendar
  const [isSingleDay, setIsSingleDay] = useState(true);
  const [startDate, setStartDate] = useState(todayISO());
  const [startHour, setStartHour] = useState(9);
  const [playDays, setPlayDays] = useState<number[]>([6]);
  const [maxMatchesPerDay, setMaxMatchesPerDay] = useState(2);
  const [hasFinalDay, setHasFinalDay] = useState(false);
  const [finalDayDate, setFinalDayDate] = useState(todayISO());
  const [activeDateField, setActiveDateField] = useState<
    "startDate" | "finalDayDate" | null
  >(null);

  // Derived: max play days allowed based on total matches and matches per day
  const matchInfoDerived: TournametNumberPartecipants = estimateTotalMatches(
    numTeams,
    format,
    phaseKind,
    effGroups,
    phaseKind === "multi" ? knockoutFormat : undefined,
  );
  const maxPerDayCapDerived = Math.max(numFields, matchInfoDerived.total - 1);
  const effectiveMatchesPerDay = Math.min(
    Math.max(maxMatchesPerDay, numFields),
    maxPerDayCapDerived,
  );
  const maxDaysNeeded = Math.max(
    1,
    Math.ceil(matchInfoDerived.total / effectiveMatchesPerDay),
  );

  // Auto-trim selected play days when maxDaysNeeded decreases
  useEffect(() => {
    if (!isSingleDay && playDays.length > maxDaysNeeded) {
      setPlayDays((prev) => prev.slice(0, maxDaysNeeded));
    }
  }, [maxDaysNeeded, isSingleDay]);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateStep(): boolean {
    if (step === 1 && !tournamentName.trim()) {
      Alert.alert("Nome mancante", "Inserisci il nome del torneo.");
      return false;
    }
    if (step === 1 && !location.trim()) {
      Alert.alert("Luogo mancante", "Inserisci il luogo del torneo.");
      return false;
    }
    if (step === 3 && numTeams < 2) {
      Alert.alert("Partecipanti insufficienti", "Servono almeno 2 squadre.");
      return false;
    }
    if (step === 5) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        Alert.alert(
          "Data non valida",
          "Inserisci la data nel formato YYYY-MM-DD.",
        );
        return false;
      }
      if (!isSingleDay && playDays.length === 0) {
        Alert.alert("Giorni mancanti", "Seleziona almeno un giorno di gioco.");
        return false;
      }
      if (!isSingleDay && playDays.length > maxDaysNeeded) {
        Alert.alert(
          "Troppi giorni",
          `Con ${effectiveMatchesPerDay} partite al giorno e ${matchInfoDerived.total} partite totali, bastano ${maxDaysNeeded} giorn${maxDaysNeeded === 1 ? "o" : "i"}.`,
        );
        return false;
      }
      if (
        !isSingleDay &&
        hasFinalDay &&
        !/^\d{4}-\d{2}-\d{2}$/.test(finalDayDate)
      ) {
        Alert.alert(
          "Data Final Day",
          "Inserisci la data del Final Day nel formato YYYY-MM-DD.",
        );
        return false;
      }
      if (!isSingleDay && hasFinalDay && finalDayDate <= startDate) {
        Alert.alert(
          "Data Final Day",
          "La data del Final Day deve essere successiva alla data di inizio.",
        );
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step < 5) setStep((p) => (p + 1) as 1 | 2 | 3 | 4 | 5);
    else handleGenerate();
  }

  function handleBack() {
    if (step > 1) setStep((p) => (p - 1) as 1 | 2 | 3 | 4 | 5);
  }

  function isStepValid(): boolean {
    if (step === 1) {
      return tournamentName.trim().length > 0 && location.trim().length > 0;
    }
    if (step === 4) {
      return matchDuration > 0 && numFields > 0;
    }
    if (step === 5) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return false;
      if (!isSingleDay) {
        if (playDays.length === 0) return false;
        if (playDays.length > maxDaysNeeded) return false;
        if (hasFinalDay) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(finalDayDate)) return false;
          if (finalDayDate <= startDate) return false;
        }
      }
      return true;
    }
    return true;
  }

  function confirmCancel() {
    Alert.alert(
      "Annulla creazione",
      "Sei sicuro di voler annullare la creazione del torneo?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sì, annulla",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const participants = Array.from({ length: numTeams }, (_, i) => ({
        name: `Squadra ${i + 1}`,
      }));

      const mInfo = estimateTotalMatches(
        numTeams,
        format,
        phaseKind,
        effGroups,
        phaseKind === "multi" ? knockoutFormat : undefined,
      );
      const cappedPerDay = Math.min(
        Math.max(maxMatchesPerDay, numFields),
        Math.max(numFields, mInfo.total - 1),
      );

      const config = {
        tournamentName: tournamentName.trim(),
        description: description.trim(),
        location: location.trim(),
        participants,
        phaseKind,
        format,
        multiKnockoutFormat: phaseKind === "multi" ? knockoutFormat : undefined,
        numGroups: phaseKind === "multi" ? effGroups : undefined,
        numFields,
        matchDurationMinutes: matchDuration,
        restMinutes,
        travelMinutes,
        startDate,
        startHour,
        playDays: isSingleDay ? [0, 1, 2, 3, 4, 5, 6] : playDays,
        maxMatchesPerDayPerTeam: isSingleDay ? 999 : cappedPerDay,
        maxMatchesPerDay: isSingleDay ? undefined : cappedPerDay,
        hasFinalDay: isSingleDay ? false : hasFinalDay,
        finalDayDate: !isSingleDay && hasFinalDay ? finalDayDate : undefined,
        singleDay: isSingleDay,
      };

      const payload: CreateTournamentPayload = {
        config,
        lat: locationLat,
        lng: locationLng,
      };
      await createTournament(payload, user?.token);

      navigation.replace("TournamentScheduleResult");
    } catch (e: unknown) {
      Alert.alert(
        "Errore",
        e instanceof Error ? e.message : "Errore nella generazione.",
      );
    } finally {
      setGenerating(false);
    }
  }

  // ── Step indicator ──────────────────────────────────────────────────────────
  function renderStepIndicator() {
    return (
      <View style={s.stepBar}>
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <React.Fragment key={n}>
            <View
              style={[
                s.stepDot,
                step === n && s.stepDotActive,
                step > n && s.stepDotDone,
              ]}
            >
              {step > n ? (
                <Ionicons name="checkmark" size={14} color={colors.primary} />
              ) : (
                <Text
                  style={[s.stepDotText, step === n && s.stepDotTextActive]}
                >
                  {n}
                </Text>
              )}
            </View>
            {n < 5 && <View style={[s.stepLine, step > n && s.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.root} edges={["top"]}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerSide} onPress={confirmCancel}>
          <Ionicons name="chevron-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{STEP_TITLES[step - 1]}</Text>
        <View style={s.headerSide} />
      </View>

      {renderStepIndicator()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 &&
            renderStep1({
              setTournamentName,
              tournamentName,
              description,
              setDescription,
              location,
              setLocation,
              setLocationLat,
              setLocationLng,
            })}
          {step === 2 &&
            renderStep2({
              phaseKind,
              setPhaseKind,
              format,
              setFormat,
              knockoutFormat,
              setKnockoutFormat,
            })}
          {step === 3 &&
            renderStep3({
              numTeams,
              setNumGroups,
              setNumTeams,
              effGroups,
              format,
              phaseKind,
              knockoutFormat,
              maxGroups,
            })}
          {step === 4 &&
            renderStep4({
              numFields,
              setNumFields,
              setMatchDuration,
              setRestMinutes,
              setTravelMinutes,
              numTeams,
              matchDuration,
              restMinutes,
              travelMinutes,
            })}
          {step === 5 &&
            renderStep5({
              isSingleDay,
              setIsSingleDay,
              startDate,
              setStartDate,
              startHour,
              setStartHour,
              playDays,
              setPlayDays,
              maxMatchesPerDay,
              setMaxMatchesPerDay,
              hasFinalDay,
              setHasFinalDay,
              finalDayDate,
              setFinalDayDate,
              maxDaysNeeded,
              effectiveMatchesPerDay,
              matchInfoDerived,
              numTeams,
              format,
              phaseKind,
              knockoutFormat,
              effGroups,
              numFields,
              matchDuration,
              restMinutes,
              travelMinutes,
              activeDateField,
              setActiveDateField,
            })}
        </ScrollView>

        <SafeAreaView edges={["bottom"]}>
          <View style={s.bottomNav}>
            {step > 1 && (
              <ButtonBorderColored
                isColored
                handleBtn={handleBack}
                text="Indietro"
                fullColor={colors.grayDark}
              />
            )}

            <ButtonGradient
              handleBtn={handleNext}
              isDisabled={generating || !isStepValid()}
              loading={generating}
              isFullWidth
              style={[
                s.btnNext,
                {
                  opacity: generating || !isStepValid() ? 0.5 : 1,
                },
              ]}
            >
              <Text style={s.btnNextText}>
                {step === 5 ? "Crea" : "Avanti"}
              </Text>
            </ButtonGradient>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
