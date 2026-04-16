import React from "react";
import { TouchableOpacity, View, Text, Alert, Switch } from "react-native";
import {
  DAY_LABELS,
  TournamentFormat,
  TournamentPhaseKind,
} from "../../../constants/tournament";
import { estimateTotalMatches } from "../../../functions/tournamet";
import { s } from "../CreateTournamentSchedule.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { Stepper } from "../../../components/Stepper/Stepper";
import {
  ButtonBorderColored,
  ButtonGeneric,
} from "../../../components/Button/Button";
import { DatePickerModal } from "../../../components/DatePicker/DatePicker";
import { sizesEnum } from "../../../theme/dimension";
import { todayISO } from "../../../functions/general";
import { TournametNumberPartecipants } from "../../../types/tournament";

interface renderStep5Props {
  isSingleDay: boolean;
  setIsSingleDay: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  startHour: number;
  setStartHour: React.Dispatch<React.SetStateAction<number>>;
  playDays: number[];
  setPlayDays: React.Dispatch<React.SetStateAction<number[]>>;
  maxMatchesPerDay: number;
  setMaxMatchesPerDay: React.Dispatch<React.SetStateAction<number>>;
  hasFinalDay: boolean;
  setHasFinalDay: React.Dispatch<React.SetStateAction<boolean>>;
  finalDayDate: string;
  setFinalDayDate: React.Dispatch<React.SetStateAction<string>>;
  maxDaysNeeded: number;
  effectiveMatchesPerDay: number;
  matchInfoDerived: TournametNumberPartecipants;
  numTeams: number;
  format: TournamentFormat;
  phaseKind: TournamentPhaseKind;
  knockoutFormat: TournamentFormat;
  effGroups: number;
  matchDuration: number;
  travelMinutes: number;
  restMinutes: number;
  numFields: number;
  // Date picker modal control
  activeDateField: "startDate" | "finalDayDate" | null;
  setActiveDateField: React.Dispatch<
    React.SetStateAction<"startDate" | "finalDayDate" | null>
  >;
}

export function renderStep5({
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
}: renderStep5Props) {
  // ── Picker callbacks ────────────────────────────────────────────────────────
  function handlePickerConfirm(iso: string) {
    if (activeDateField === "startDate") setStartDate(iso);
    else if (activeDateField === "finalDayDate") setFinalDayDate(iso);
    setActiveDateField(null);
  }

  function handlePickerCancel() {
    setActiveDateField(null);
  }

  // ── Local helpers ───────────────────────────────────────────────────────────
  function toggleDay(day: number) {
    setPlayDays((prev) => {
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      if (prev.length >= maxDaysNeeded) {
        Alert.alert(
          "Giorni sufficienti",
          `Con ${effectiveMatchesPerDay} partite al giorno e ${matchInfoDerived.total} partite totali, bastano ${maxDaysNeeded} giorn${maxDaysNeeded === 1 ? "o" : "i"}.`,
        );
        return prev;
      }
      return [...prev, day];
    });
  }

  function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }

  function np2(n: number): number {
    let p = 1;
    while (p < n) p *= 2;
    return p;
  }

  function koSubRounds(n: number, fields: number): number {
    if (n < 2) return 0;
    const nb = np2(n);
    const byes = nb - n;
    const r1 = Math.floor((n - byes) / 2);
    let total = r1 > 0 ? Math.ceil(r1 / fields) : 0;
    let rem = nb / 2;
    while (rem > 1) {
      rem = rem / 2;
      total += Math.ceil(rem / fields) || 1;
    }
    return total;
  }

  function estimateSubRounds(
    numTeams: number,
    format: TournamentFormat,
    phaseKind: TournamentPhaseKind,
    fields: number,
    numGroups: number,
    koFormat?: TournamentFormat,
  ): number {
    const c = Math.ceil;
    function rrSR(n: number): number {
      const eff = n % 2 === 0 ? n : n + 1;
      return (eff - 1) * c(eff / 2 / fields);
    }
    function deSR(n: number): number {
      return koSubRounds(n, fields) * 2 + 1;
    }
    if (phaseKind === "multi") {
      const effGroups = Math.max(1, numGroups);
      const tpg = Math.ceil(numTeams / effGroups);
      const eff = tpg % 2 === 0 ? tpg : tpg + 1;
      const matchesPerGlobalRound = effGroups * (eff / 2);
      const groupSubRounds = (eff - 1) * c(matchesPerGlobalRound / fields);
      const advancing = Math.min(effGroups * 2, numTeams);
      const koSub =
        koFormat === "double-elimination"
          ? deSR(advancing)
          : koSubRounds(advancing, fields);
      return groupSubRounds + koSub;
    }
    switch (format) {
      case "round-robin":
        return rrSR(numTeams);
      case "knockout":
        return koSubRounds(numTeams, fields);
      case "double-elimination":
        return deSR(numTeams);
    }
    return 0;
  }

  const totalSR = estimateSubRounds(
    numTeams,
    format,
    phaseKind,
    numFields,
    effGroups,
    phaseKind === "multi" ? knockoutFormat : undefined,
  );
  const matchInfo5 = estimateTotalMatches(
    numTeams,
    format,
    phaseKind,
    effGroups,
    phaseKind === "multi" ? knockoutFormat : undefined,
  );
  const maxPerDayCap = Math.max(numFields, matchInfo5.total - 1);
  const slot = matchDuration + restMinutes + travelMinutes;
  const durationMins = totalSR > 0 ? (totalSR - 1) * slot + matchDuration : 0;
  const endTotalMins = startHour * 60 + durationMins;
  const endHour = Math.floor(endTotalMins / 60);
  const endMin = endTotalMins % 60;
  const endTimeStr = `${endHour % 24}:${String(endMin).padStart(2, "0")}`;
  const spansNextDay = endTotalMins >= 24 * 60;

  // The minimum allowed date for finalDayDate is the day after startDate
  const finalDayMin = (() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    return todayISO.toString();
  })();

  return (
    <>
      {/* Date picker modal — rendered once, controlled by activeDateField */}
      <DatePickerModal
        visible={activeDateField !== null}
        currentValue={
          activeDateField === "startDate"
            ? startDate
            : activeDateField === "finalDayDate"
              ? finalDayDate
              : ""
        }
        minDate={
          activeDateField === "finalDayDate" ? finalDayMin : todayISO.toString()
        }
        onConfirm={handlePickerConfirm}
        onCancel={handlePickerCancel}
      />

      <Text style={s.sectionTitle}>Calendario</Text>
      <Text style={s.sectionSub}>
        Il torneo si svolge in una giornata unica o su più giorni?
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <ButtonGeneric
          style={[
            s.optionCard,
            s.singleDay,
            isSingleDay && s.optionCardSelected,
          ]}
          handleBtn={() => setIsSingleDay(true)}
        >
          <Ionicons
            name="sunny-outline"
            size={26}
            color={isSingleDay ? colors.primary : colors.placeholder}
          />
          <Text
            style={[
              s.optionCardTitle,
              { marginTop: 6, textAlign: "center" },
              isSingleDay && { color: colors.primary },
            ]}
          >
            Giornata{"\n"}Unica
          </Text>
        </ButtonGeneric>
        <ButtonGeneric
          style={[
            s.optionCard,
            s.singleDay,
            !isSingleDay && s.optionCardSelected,
          ]}
          handleBtn={() => setIsSingleDay(false)}
        >
          <Ionicons
            name="calendar-outline"
            size={26}
            color={!isSingleDay ? colors.primary : colors.placeholder}
          />
          <Text
            style={[
              s.optionCardTitle,
              { marginTop: 6, textAlign: "center" },
              !isSingleDay && { color: colors.primary },
            ]}
          >
            Più{"\n"}Giorni
          </Text>
        </ButtonGeneric>
      </View>

      <Text style={s.sectionLabel}>Data di inizio</Text>
      <View style={[s.numberInputRow, { paddingVertical: 8 }]}>
        <Text style={s.fieldLabel}>Data di inizio</Text>
        <ButtonBorderColored
          text={startDate}
          handleBtn={() => setActiveDateField("startDate")}
          iconLeft={
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.primary}
              style={{ marginRight: 6 }}
            />
          }
          isColored
          size={sizesEnum.medium}
        />
      </View>

      <View style={s.fieldRow}>
        <View style={s.optionCardBody}>
          <Text style={s.fieldLabel}>Orario inizio</Text>
          <Text style={s.fieldSub}>Prima partita del torneo</Text>
        </View>
        <Stepper
          value={startHour}
          min={6}
          max={22}
          onChange={setStartHour}
          fmt={(h) => `${h}:00`}
        />
      </View>

      {/* Single day: show estimated end time */}
      {isSingleDay && (
        <>
          <View
            style={[
              s.infoBox,
              {
                backgroundColor: colors.primarySelectedBg,
                borderColor: colors.primary,
                marginTop: 16,
              },
            ]}
          >
            <Ionicons name="time-outline" size={22} color={colors.primary} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={[
                  s.infoBoxText,
                  { color: colors.dark, fontWeight: "700", fontSize: 15 },
                ]}
              >
                Fine stimata: {endTimeStr}
                {spansNextDay ? " (+1 giorno)" : ""}
              </Text>
              <Text style={[s.infoBoxText, { color: colors.placeholder }]}>
                Durata: {formatDuration(durationMins)} · {totalSR} turni su{" "}
                {numFields} camp{numFields === 1 ? "o" : "i"}
              </Text>
            </View>
          </View>
          {spansNextDay && (
            <View style={s.warningBox}>
              <Ionicons
                name="warning-outline"
                size={18}
                color={colors.primaryGradientMid}
              />
              <Text style={s.warningBoxText}>
                Il torneo supera la mezzanotte. Riduci le squadre, aumenta i
                campi o riduci i tempi di pausa.
              </Text>
            </View>
          )}
        </>
      )}

      {/* Multi-day: full calendar config */}
      {!isSingleDay && (
        <>
          <Text style={s.sectionLabel}>Giorni di gioco</Text>
          <View style={s.daysRow}>
            {DAY_LABELS.map((label, idx) => (
              <TouchableOpacity
                key={idx}
                style={[s.dayBtn, playDays.includes(idx) && s.dayBtnSelected]}
                onPress={() => toggleDay(idx)}
              >
                <Text
                  style={[
                    s.dayBtnText,
                    playDays.includes(idx) && s.dayBtnTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={[
              s.infoBox,
              { backgroundColor: colors.blueBg, borderColor: colors.lightBlue },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.blue}
            />
            <Text style={[s.infoBoxText, { color: colors.darkBlue }]}>
              {matchInfoDerived.total} partite totali con{" "}
              {effectiveMatchesPerDay} partite/giorno → massimo {maxDaysNeeded}{" "}
              giorn{maxDaysNeeded === 1 ? "o" : "i"} selezionabil
              {maxDaysNeeded === 1 ? "e" : "i"} ({playDays.length}/
              {maxDaysNeeded})
            </Text>
          </View>

          <Text style={s.sectionLabel}>Limiti giornalieri</Text>
          <View style={s.fieldRow}>
            <View style={s.optionCardBody}>
              <Text style={s.fieldLabel}>Partite al giorno</Text>
              <Text style={s.fieldSub}>
                Numero esatto di partite per ogni giornata
              </Text>
            </View>
            <Stepper
              value={Math.min(
                Math.max(maxMatchesPerDay, numFields),
                maxPerDayCap,
              )}
              min={numFields}
              max={maxPerDayCap}
              onChange={setMaxMatchesPerDay}
            />
          </View>

          <View style={s.toggleRow}>
            <View>
              <Text style={s.toggleLabel}>Final Day dedicato</Text>
              <Text style={s.toggleSub}>
                Quarti, semifinale e finale in un giorno dedicato
              </Text>
            </View>
            <Switch
              value={hasFinalDay}
              onValueChange={setHasFinalDay}
              trackColor={{
                false: colors.disabled,
                true: colors.primaryGradientMid,
              }}
              thumbColor={colors.white}
            />
          </View>

          {hasFinalDay && (
            <>
              <Text style={s.sectionLabel}>Data Final Day</Text>
              <View style={s.numberInputRow}>
                <Text style={s.fieldLabel}>Giorno Final Day</Text>
                <ButtonBorderColored
                  text={finalDayDate}
                  handleBtn={() => setActiveDateField("finalDayDate")}
                  iconLeft={
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.primary}
                      style={{ marginRight: 6 }}
                    />
                  }
                  isColored
                  size={sizesEnum.medium}
                />
              </View>
              <View
                style={[
                  s.infoBox,
                  {
                    backgroundColor: colors.blueBg,
                    borderColor: colors.lightBlue,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.blue}
                />
                <Text style={[s.infoBoxText, { color: colors.darkBlue }]}>
                  Quarti di finale, semifinali e finale si giocheranno il giorno
                  selezionato.
                </Text>
              </View>
            </>
          )}

          <View style={s.infoBox}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={s.infoBoxText}>
              Il calendario rispetterà i giorni selezionati con esattamente{" "}
              {Math.min(Math.max(maxMatchesPerDay, numFields), maxPerDayCap)}{" "}
              partit
              {Math.min(Math.max(maxMatchesPerDay, numFields), maxPerDayCap) ===
              1
                ? "a"
                : "e"}{" "}
              al giorno (su {numFields} camp{numFields === 1 ? "o" : "i"}).
            </Text>
          </View>
        </>
      )}
    </>
  );
}
