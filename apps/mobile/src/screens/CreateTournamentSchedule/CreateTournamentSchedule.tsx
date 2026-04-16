import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  type RootStackParamList,
  NavigationEnum,
} from "../../types/navigation";
import { useMutation } from "@tanstack/react-query";
import { createTournament } from "../../api/tournaments";
import { useAuth } from "../../context/AuthContext";
import { s } from "./CreateTournamentSchedule.styles";
import { renderStep1 } from "./steps/step1";
import { renderStep2 } from "./steps/step2";
import { renderStep3 } from "./steps/step3";
import { estimateTotalMatches } from "../../functions/tournamet";
import { renderStep4 } from "./steps/step4";
import { renderStep5 } from "./steps/step5";
import {
  STEP_TITLES_TOURNAMENT,
  TournamentFormat,
  TournamentPhaseKind,
} from "../../constants/tournament";
import { StructureSchedule } from "../../components/StructureSchedule/StructureSchedule";
import { todayISO } from "../../functions/general";
import {
  CreateTournamentPayload,
  TournametNumberPartecipants,
} from "../../types/tournament";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "CreateTournamentSchedule"
>;

export default function CreateTournamentSchedule({ navigation }: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const createMutation = useMutation({
    mutationFn: (payload: CreateTournamentPayload) =>
      createTournament(payload, user?.token ?? ''),
    onSuccess: () => {
      navigation.replace(NavigationEnum.TOURNAMENT_SCHEDULE_RESULT);
    },
    onError: (e: unknown) => {
      Alert.alert(
        "Errore",
        e instanceof Error ? e.message : "Errore nella generazione.",
      );
    },
  });
  const generating = createMutation.isPending;

  // Step 1: Tournament info
  const [tournamentName, setTournamentName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLat, setLocationLat] = useState<number | undefined>(undefined);
  const [locationLng, setLocationLng] = useState<number | undefined>(undefined);
  const [regulationFileName, setRegulationFileName] = useState<string | null>(
    null,
  );
  const [regulationFileUri, setRegulationFileUri] = useState<string | null>(
    null,
  );

  // Step 2: Structure (chosen first)
  const [phaseKind, setPhaseKind] = useState<TournamentPhaseKind>(
    TournamentPhaseKind.SINGLE,
  );
  const [format, setFormat] = useState<TournamentFormat>(
    TournamentFormat.ROUND_ROBIN,
  );
  const [knockoutFormat, setKnockoutFormat] = useState<TournamentFormat>(
    TournamentFormat.KNOCKOUT,
  );

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

  const handleGenerate = useCallback(async () => {
    if (!isStepValid()) return;
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
      regulationUri: regulationFileUri ?? undefined,
    };
    createMutation.mutate(payload);
  }, [numTeams, format, phaseKind, effGroups, knockoutFormat, numFields,
      matchDuration, restMinutes, travelMinutes, startDate, startHour,
      isSingleDay, playDays, hasFinalDay, finalDayDate, locationLat,
      locationLng, regulationFileUri, createMutation]);

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

  return (
    <StructureSchedule
      numberSteps={5}
      handleGenerate={handleGenerate}
      validateStep={validateStep}
      step={step}
      setStep={setStep}
      generating={generating}
      stepTitles={STEP_TITLES_TOURNAMENT}
      isStepValid={isStepValid}
      navigation={navigation}
      cancelTitle="Annulla creazione"
      cancelMessage="Sei sicuro di voler annullare la creazione del torneo?"
      lastStepLabel="Crea"
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
            locationLat,
            locationLng,
            regulationFileName,
            setRegulationFileName,
            setRegulationFileUri,
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
    </StructureSchedule>
    // <SafeAreaView style={s.root} edges={["top"]}>
    //   <View style={s.header}>
    //     <TouchableOpacity style={s.headerSide} onPress={confirmCancel}>
    //       <Ionicons name="chevron-back" size={24} color={colors.dark} />
    //     </TouchableOpacity>
    //     <Text style={s.headerTitle}>{STEP_TITLES[step - 1]}</Text>
    //     <View style={s.headerSide} />
    //   </View>

    //   {renderStepIndicator()}

    //   <KeyboardAvoidingView
    //     style={{ flex: 1 }}
    //     behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   >
    // <ScrollView
    //   style={{ flex: 1 }}
    //   contentContainerStyle={s.scroll}
    //   keyboardShouldPersistTaps="handled"
    //   showsVerticalScrollIndicator={false}
    // >
    //   {step === 1 &&
    //     renderStep1({
    //       setTournamentName,
    //       tournamentName,
    //       description,
    //       setDescription,
    //       location,
    //       setLocation,
    //       setLocationLat,
    //       setLocationLng,
    //       locationLat,
    //       locationLng,
    //       regulationFileName,
    //       setRegulationFileName,
    //       setRegulationFileUri,
    //     })}
    //   {step === 2 &&
    //     renderStep2({
    //       phaseKind,
    //       setPhaseKind,
    //       format,
    //       setFormat,
    //       knockoutFormat,
    //       setKnockoutFormat,
    //     })}
    //   {step === 3 &&
    //     renderStep3({
    //       numTeams,
    //       setNumGroups,
    //       setNumTeams,
    //       effGroups,
    //       format,
    //       phaseKind,
    //       knockoutFormat,
    //       maxGroups,
    //     })}
    //   {step === 4 &&
    //     renderStep4({
    //       numFields,
    //       setNumFields,
    //       setMatchDuration,
    //       setRestMinutes,
    //       setTravelMinutes,
    //       numTeams,
    //       matchDuration,
    //       restMinutes,
    //       travelMinutes,
    //     })}
    //   {step === 5 &&
    //     renderStep5({
    //       isSingleDay,
    //       setIsSingleDay,
    //       startDate,
    //       setStartDate,
    //       startHour,
    //       setStartHour,
    //       playDays,
    //       setPlayDays,
    //       maxMatchesPerDay,
    //       setMaxMatchesPerDay,
    //       hasFinalDay,
    //       setHasFinalDay,
    //       finalDayDate,
    //       setFinalDayDate,
    //       maxDaysNeeded,
    //       effectiveMatchesPerDay,
    //       matchInfoDerived,
    //       numTeams,
    //       format,
    //       phaseKind,
    //       knockoutFormat,
    //       effGroups,
    //       numFields,
    //       matchDuration,
    //       restMinutes,
    //       travelMinutes,
    //       activeDateField,
    //       setActiveDateField,
    //     })}
    // </ScrollView>

    //     <SafeAreaView edges={["bottom"]}>
    //       <View style={s.bottomNav}>
    //         <ButtonBorderColored
    //           isColored
    //           handleBtn={handleBack}
    //           text="Indietro"
    //           fullColor={colors.grayDark}
    //           isDisabled={step === 1}
    //         />

    //         <ButtonGradient
    //           handleBtn={handleNext}
    //           isDisabled={generating || !isStepValid()}
    //           loading={generating}
    //           isFullWidth
    //           style={[
    //             s.btnNext,
    //             {
    //               opacity: generating || !isStepValid() ? 0.5 : 1,
    //             },
    //           ]}
    //         >
    //           <Text style={s.btnNextText}>
    //             {step === 5 ? "Crea" : "Avanti"}
    //           </Text>
    //         </ButtonGradient>
    //       </View>
    //     </SafeAreaView>
    //   </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}
