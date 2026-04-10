import React, { useRef, useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Switch,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  ListRenderItem,
} from "react-native";
import { DAY_LABELS } from "../../../constants/formatTournament";
import { estimateTotalMatches } from "../../../functions/tournamet";
import {
  TournamentFormat,
  TournamentPhaseKind,
  TournametNumberPartecipants,
} from "../../../types";
import { s } from "../CreateTournamentSchedule.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { Stepper } from "../../../components/Stepper/Stepper";
import { ButtonGeneric } from "../../../components/Button/Button";

// ── Date picker constants ────────────────────────────────────────────────────

const ITEM_H = 48;
const VISIBLE_ITEMS = 5;
const PICKER_H = ITEM_H * VISIBLE_ITEMS;

const MONTHS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function parseISO(iso: string): { year: number; month: number; day: number } {
  const today = new Date();
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return { year: y, month: m - 1, day: d };
  }
  return {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  };
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ── DatePickerModal ──────────────────────────────────────────────────────────

interface DatePickerModalProps {
  visible: boolean;
  currentValue: string; // YYYY-MM-DD or ""
  minDate: string; // YYYY-MM-DD
  onConfirm: (iso: string) => void;
  onCancel: () => void;
}

function DatePickerModal({
  visible,
  currentValue,
  minDate,
  onConfirm,
  onCancel,
}: DatePickerModalProps) {
  const today = new Date();
  const minParsed = parseISO(minDate);

  const START_YEAR = Math.max(today.getFullYear(), minParsed.year);
  const END_YEAR = START_YEAR + 5;

  const years: number[] = Array.from(
    { length: END_YEAR - START_YEAR + 1 },
    (_, i) => START_YEAR + i,
  );

  const initial = parseISO(currentValue || minDate);
  const clampedInitialYear = Math.min(
    Math.max(initial.year, START_YEAR),
    END_YEAR,
  );

  const [selYear, setSelYear] = useState(clampedInitialYear);
  const [selMonth, setSelMonth] = useState(initial.month);
  const [selDay, setSelDay] = useState(initial.day);

  const yearRef = useRef<FlatList>(null);
  const monthRef = useRef<FlatList>(null);
  const dayRef = useRef<FlatList>(null);

  const numDays = daysInMonth(selYear, selMonth);
  const days: number[] = Array.from({ length: numDays }, (_, i) => i + 1);

  // Clamp day when month/year changes
  useEffect(() => {
    const max = daysInMonth(selYear, selMonth);
    if (selDay > max) setSelDay(max);
  }, [selYear, selMonth]);

  // Reset selection and scroll when modal opens
  useEffect(() => {
    if (!visible) return;
    const next = parseISO(currentValue || minDate);
    const clampedYear = Math.min(Math.max(next.year, START_YEAR), END_YEAR);
    setSelYear(clampedYear);
    setSelMonth(next.month);
    setSelDay(next.day);

    const yearIdx = years.indexOf(clampedYear);
    const monthIdx = next.month;
    const dayIdx = next.day - 1;

    // Defer scrolls so FlatList has rendered
    setTimeout(() => {
      yearRef.current?.scrollToIndex({
        index: Math.max(yearIdx, 0),
        animated: false,
      });
      monthRef.current?.scrollToIndex({
        index: Math.max(monthIdx, 0),
        animated: false,
      });
      dayRef.current?.scrollToIndex({
        index: Math.max(dayIdx, 0),
        animated: false,
      });
    }, 50);
  }, [visible]);

  function renderYearItem({ item }: { item: number }) {
    const selected = item === selYear;
    return (
      <TouchableOpacity
        style={[dp.item, selected && dp.itemSelected]}
        onPress={() => {
          setSelYear(item);
          const idx = years.indexOf(item);
          yearRef.current?.scrollToIndex({ index: idx, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderMonthItem({ item, index }: { item: string; index: number }) {
    const selected = index === selMonth;
    return (
      <TouchableOpacity
        style={[dp.item, selected && dp.itemSelected]}
        onPress={() => {
          setSelMonth(index);
          monthRef.current?.scrollToIndex({ index, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderDayItem({ item }: { item: number }) {
    const selected = item === selDay;
    return (
      <TouchableOpacity
        style={[dp.item, selected && dp.itemSelected]}
        onPress={() => {
          setSelDay(item);
          dayRef.current?.scrollToIndex({ index: item - 1, animated: true });
        }}
        activeOpacity={0.7}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {String(item).padStart(2, "0")}
        </Text>
      </TouchableOpacity>
    );
  }

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_H,
    offset: ITEM_H * index,
    index,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={dp.backdrop} onPress={onCancel} />

      <View style={dp.sheet}>
        {/* Header */}
        <View style={dp.header}>
          <TouchableOpacity onPress={onCancel} style={dp.headerBtn}>
            <Text style={dp.cancelText}>Annulla</Text>
          </TouchableOpacity>
          <Text style={dp.headerTitle}>Seleziona data</Text>
          <TouchableOpacity
            onPress={() => onConfirm(toISO(selYear, selMonth, selDay))}
            style={dp.headerBtn}
          >
            <Text style={dp.confirmText}>Conferma</Text>
          </TouchableOpacity>
        </View>

        {/* Columns */}
        <View style={dp.columns}>
          {/* Year */}
          <View style={dp.column}>
            <Text style={dp.colLabel}>Anno</Text>
            <FlatList
              ref={yearRef}
              data={years}
              keyExtractor={(item) => String(item)}
              renderItem={renderYearItem as ListRenderItem<number>}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              style={dp.list}
              contentContainerStyle={dp.listContent}
              onScrollToIndexFailed={() => {}}
            />
          </View>

          {/* Month */}
          <View style={dp.column}>
            <Text style={dp.colLabel}>Mese</Text>
            <FlatList
              ref={monthRef}
              data={MONTHS}
              keyExtractor={(_, i) => String(i)}
              renderItem={renderMonthItem as ListRenderItem<string>}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              style={dp.list}
              contentContainerStyle={dp.listContent}
              onScrollToIndexFailed={() => {}}
            />
          </View>

          {/* Day */}
          <View style={dp.column}>
            <Text style={dp.colLabel}>Giorno</Text>
            <FlatList
              ref={dayRef}
              data={days}
              keyExtractor={(item) => String(item)}
              renderItem={renderDayItem as ListRenderItem<number>}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              style={dp.list}
              contentContainerStyle={dp.listContent}
              onScrollToIndexFailed={() => {}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Picker-local styles
const dp = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.disabled,
  },
  headerBtn: { paddingHorizontal: 4, paddingVertical: 4 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  cancelText: {
    fontSize: 15,
    color: colors.placeholder,
    fontWeight: "600",
  },
  confirmText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "700",
  },
  columns: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  colLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.grayDark,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  list: {
    height: PICKER_H,
    width: "100%",
  },
  listContent: {
    paddingVertical: (PICKER_H - ITEM_H) / 2,
  },
  item: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 4,
  },
  itemSelected: {
    backgroundColor: colors.primarySelectedBg,
  },
  itemText: {
    fontSize: 16,
    color: colors.placeholder,
    fontWeight: "500",
  },
  itemTextSelected: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 18,
  },
});

// ── DateTrigger (shared UI for both date fields) ─────────────────────────────

interface DateTriggerProps {
  value: string;
  placeholder: string;
  onPress: () => void;
}

function DateTrigger({ value, placeholder, onPress }: DateTriggerProps) {
  const hasValue = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={dt.trigger}>
      <Ionicons
        name="calendar-outline"
        size={16}
        color={hasValue ? colors.dark : colors.placeholder}
        style={{ marginRight: 6 }}
      />
      <Text style={[dt.text, !hasValue && dt.placeholder]}>
        {hasValue ? value : placeholder}
      </Text>
    </TouchableOpacity>
  );
}

const dt = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySelectedBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 130,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
  },
  placeholder: {
    color: colors.placeholder,
    fontWeight: "500",
  },
});

// ── renderStep5 ──────────────────────────────────────────────────────────────

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

  const todayISO = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  // The minimum allowed date for finalDayDate is the day after startDate
  const finalDayMin = (() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    return todayISO;
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
        minDate={activeDateField === "finalDayDate" ? finalDayMin : todayISO}
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
      <View style={s.numberInputRow}>
        <Text style={s.fieldLabel}>Data di inizio</Text>
        <DateTrigger
          value={startDate}
          placeholder="Seleziona data"
          onPress={() => setActiveDateField("startDate")}
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
                <DateTrigger
                  value={finalDayDate}
                  placeholder="Seleziona data"
                  onPress={() => setActiveDateField("finalDayDate")}
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
