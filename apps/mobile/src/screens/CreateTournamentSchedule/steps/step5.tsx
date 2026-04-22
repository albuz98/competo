import React from "react";
import { TouchableOpacity, View, Text, Alert, Switch } from "react-native";
import {
  DAY_LABELS,
  FINAL_DAY_ROUNDS,
  FinalDayRound,
  TournamentFormat,
  TournamentPhaseKind,
} from "../../../constants/tournament";
import { estimateTotalMatches } from "../../../functions/tournamet";
import { s } from "../CreateTournamentSchedule.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { Stepper } from "../../../components/core/Stepper/Stepper";
import {
  ButtonBorderColored,
  ButtonGeneric,
} from "../../../components/core/Button/Button";
import { DatePickerModal } from "../../../components/core/DatePicker/DatePicker";
import { sizesEnum } from "../../../theme/dimension";
import { todayISO } from "../../../functions/general";
import { TournametNumberPartecipants } from "../../../types/tournament";

// Ordered list of all final day rounds (earliest first)
const ROUND_ORDER: FinalDayRound[] = [
  FinalDayRound.QUARTI,
  FinalDayRound.SEMIFINALI,
  FinalDayRound.TERZO_POSTO,
  FinalDayRound.FINALE,
];

// Matches played in each round
const ROUND_MATCHES: Record<FinalDayRound, number> = {
  [FinalDayRound.QUARTI]: 4,
  [FinalDayRound.SEMIFINALI]: 2,
  [FinalDayRound.TERZO_POSTO]: 1,
  [FinalDayRound.FINALE]: 1,
};

function getIncludedRounds(startRound: FinalDayRound): FinalDayRound[] {
  return ROUND_ORDER.slice(ROUND_ORDER.indexOf(startRound));
}

function computeFinalDayDuration(
  startRound: FinalDayRound,
  numFields: number,
  matchDuration: number,
  timeBetween: number,
): { totalMatches: number; subRounds: number; durationMins: number } {
  const included = getIncludedRounds(startRound);

  // TERZO_POSTO and FINALE are played at the same stage — they can run in
  // parallel if there are enough fields, so count them as one combined slot.
  const groups: FinalDayRound[][] = [];
  for (const r of included) {
    const isFinishingRound =
      r === FinalDayRound.TERZO_POSTO || r === FinalDayRound.FINALE;
    const lastGroup = groups[groups.length - 1];
    if (
      isFinishingRound &&
      lastGroup?.some(
        (x) => x === FinalDayRound.TERZO_POSTO || x === FinalDayRound.FINALE,
      )
    ) {
      lastGroup.push(r);
    } else {
      groups.push([r]);
    }
  }

  let totalMatches = 0;
  let subRounds = 0;
  for (const group of groups) {
    const groupMatches = group.reduce((sum, r) => sum + ROUND_MATCHES[r], 0);
    totalMatches += groupMatches;
    subRounds += Math.ceil(groupMatches / numFields);
  }

  const durationMins =
    subRounds > 0 ? (subRounds - 1) * (matchDuration + timeBetween) + matchDuration : 0;

  return { totalMatches, subRounds, durationMins };
}

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
  finalDayHour: number;
  setFinalDayHour: React.Dispatch<React.SetStateAction<number>>;
  finalDayStartRound: FinalDayRound | null;
  setFinalDayStartRound: React.Dispatch<
    React.SetStateAction<FinalDayRound | null>
  >;
  maxDaysNeeded: number;
  effectiveMatchesPerDay: number;
  matchInfoDerived: TournametNumberPartecipants;
  numTeams: number;
  format: TournamentFormat;
  phaseKind: TournamentPhaseKind;
  effGroups: number;
  matchDuration: number;
  finaleMatchDuration: number;
  travelMinutes: number;
  finaleTravelMinutes: number;
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
  finalDayHour,
  setFinalDayHour,
  finalDayStartRound,
  setFinalDayStartRound,
  maxDaysNeeded,
  effectiveMatchesPerDay,
  matchInfoDerived,
  numTeams,
  format,
  phaseKind,
  effGroups,
  numFields,
  matchDuration,
  finaleMatchDuration,
  travelMinutes,
  finaleTravelMinutes,
  restMinutes,
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
    teams: number,
    fmt: TournamentFormat,
    pk: TournamentPhaseKind,
    fields: number,
    numGroups: number,
  ): number {
    const c = Math.ceil;
    function rrSR(n: number): number {
      const eff = n % 2 === 0 ? n : n + 1;
      return (eff - 1) * c(eff / 2 / fields);
    }
    if (pk === "multi") {
      const eg = Math.max(1, numGroups);
      const tpg = Math.ceil(teams / eg);
      const eff = tpg % 2 === 0 ? tpg : tpg + 1;
      const matchesPerGlobalRound = eg * (eff / 2);
      const groupSubRounds = (eff - 1) * c(matchesPerGlobalRound / fields);
      const advancing = Math.min(eg * 2, teams);
      return groupSubRounds + koSubRounds(advancing, fields);
    }
    switch (fmt) {
      case "round-robin":
        return rrSR(teams);
      case "knockout":
        return koSubRounds(teams, fields);
    }
    return 0;
  }

  const totalSR = estimateSubRounds(
    numTeams,
    format,
    phaseKind,
    numFields,
    effGroups,
  );
  const matchInfo5 = estimateTotalMatches(
    numTeams,
    format,
    phaseKind,
    effGroups,
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

  // Final day duration estimate (use finale match settings for the knockout phase)
  const finalDayStats =
    hasFinalDay && finalDayStartRound
      ? computeFinalDayDuration(
          finalDayStartRound,
          numFields,
          phaseKind === TournamentPhaseKind.MULTI
            ? finaleMatchDuration
            : matchDuration,
          phaseKind === TournamentPhaseKind.MULTI
            ? finaleTravelMinutes
            : travelMinutes,
        )
      : null;

  const finalDayEndMins = finalDayStats
    ? finalDayHour * 60 + finalDayStats.durationMins
    : 0;
  const finalDayEndStr = finalDayStats
    ? `${Math.floor(finalDayEndMins / 60) % 24}:${String(finalDayEndMins % 60).padStart(2, "0")}`
    : "";
  const finalDaySpansNextDay = finalDayEndMins >= 24 * 60;

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
                Seleziona da quale turno inizia il Final Day
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
              <View style={[s.numberInputRow, { paddingVertical: 8 }]}>
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

              <View style={s.fieldRow}>
                <View style={s.optionCardBody}>
                  <Text style={s.fieldLabel}>Orario inizio Final Day</Text>
                  <Text style={s.fieldSub}>Prima partita del Final Day</Text>
                </View>
                <Stepper
                  value={finalDayHour}
                  min={6}
                  max={22}
                  onChange={setFinalDayHour}
                  fmt={(h) => `${h}:00`}
                />
              </View>

              <Text style={s.sectionLabel}>Turno di partenza</Text>
              <Text style={[s.fieldSub, { marginBottom: 10 }]}>
                Seleziona da quale turno inizia il Final Day. Tutti i turni
                successivi saranno inclusi automaticamente.
              </Text>

              {FINAL_DAY_ROUNDS.map((round) => {
                const isStart = finalDayStartRound === round.value;
                const includedRounds = finalDayStartRound
                  ? getIncludedRounds(finalDayStartRound)
                  : [];
                const isIncluded =
                  !isStart && includedRounds.includes(round.value);

                return (
                  <TouchableOpacity
                    key={round.value}
                    style={[
                      s.optionCard,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        gap: 12,
                      },
                      isStart && s.optionCardSelected,
                      isIncluded && {
                        borderColor: colors.primaryGradientEnd,
                        backgroundColor: colors.primarySelectedBg,
                        opacity: 0.75,
                      },
                    ]}
                    onPress={() =>
                      setFinalDayStartRound(
                        isStart ? null : round.value,
                      )
                    }
                  >
                    <Ionicons
                      name={
                        isStart
                          ? "radio-button-on"
                          : isIncluded
                            ? "checkmark-circle-outline"
                            : "radio-button-off"
                      }
                      size={22}
                      color={
                        isStart
                          ? colors.primary
                          : isIncluded
                            ? colors.primaryGradientEnd
                            : colors.placeholder
                      }
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          s.optionCardTitle,
                          isStart && { color: colors.primary },
                          isIncluded && { color: colors.primaryGradientMid },
                        ]}
                      >
                        {round.label}
                        {isIncluded ? "  ✓ incluso" : ""}
                      </Text>
                      <Text style={s.fieldSub}>{round.sub}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Final day duration estimate */}
              {finalDayStats && (
                <View
                  style={[
                    s.infoBox,
                    {
                      backgroundColor: colors.primarySelectedBg,
                      borderColor: colors.primary,
                      marginTop: 8,
                    },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={22}
                    color={colors.primary}
                  />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={[
                        s.infoBoxText,
                        { color: colors.dark, fontWeight: "700", fontSize: 15 },
                      ]}
                    >
                      Fine stimata: {finalDayEndStr}
                      {finalDaySpansNextDay ? " (+1 giorno)" : ""}
                    </Text>
                    <Text style={[s.infoBoxText, { color: colors.placeholder }]}>
                      {finalDayStats.totalMatches} partite ·{" "}
                      {formatDuration(finalDayStats.durationMins)} · su{" "}
                      {numFields} camp{numFields === 1 ? "o" : "i"}
                    </Text>
                  </View>
                </View>
              )}
              {finalDaySpansNextDay && (
                <View style={s.warningBox}>
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={colors.primaryGradientMid}
                  />
                  <Text style={s.warningBoxText}>
                    Il Final Day supera la mezzanotte. Anticipa l'orario o
                    aumenta i campi.
                  </Text>
                </View>
              )}
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
