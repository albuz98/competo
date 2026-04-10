import { useEffect, useRef, useState } from "react";
import { dp } from "./DatePicker.styled";
import {
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ButtonGeneric } from "../Button/Button";
import { MONTHS } from "../../constants/generals";

export const ITEM_H = 48;

interface DatePickerModalProps {
  visible: boolean;
  currentValue: string; // YYYY-MM-DD or ""
  minDate: string; // YYYY-MM-DD
  onConfirm: (iso: string) => void;
  onCancel: () => void;
}

export function DatePickerModal({
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
      <ButtonGeneric
        style={[dp.item, selected && dp.itemSelected]}
        handleBtn={() => {
          setSelYear(item);
          const idx = years.indexOf(item);
          yearRef.current?.scrollToIndex({ index: idx, animated: true });
        }}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {item}
        </Text>
      </ButtonGeneric>
    );
  }

  function renderMonthItem({ item, index }: { item: string; index: number }) {
    const selected = index === selMonth;
    return (
      <ButtonGeneric
        style={[dp.item, selected && dp.itemSelected]}
        handleBtn={() => {
          setSelMonth(index);
          monthRef.current?.scrollToIndex({ index, animated: true });
        }}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {item}
        </Text>
      </ButtonGeneric>
    );
  }

  function renderDayItem({ item }: { item: number }) {
    const selected = item === selDay;
    return (
      <ButtonGeneric
        style={[dp.item, selected && dp.itemSelected]}
        handleBtn={() => {
          setSelDay(item);
          dayRef.current?.scrollToIndex({ index: item - 1, animated: true });
        }}
      >
        <Text style={[dp.itemText, selected && dp.itemTextSelected]}>
          {String(item).padStart(2, "0")}
        </Text>
      </ButtonGeneric>
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
