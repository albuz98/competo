import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  Pressable,
  Animated,
  ListRenderItem,
} from "react-native";
import { dp } from "./DatePicker.styled";
import { MONTHS } from "../../constants/generals";
import { ITEM_H, PICKER_H } from "./constants";
import { ButtonGeneric } from "../Button/Button";

const SHEET_H = PICKER_H + 24 + 52 + 32; // columns + header + paddingBottom

export interface DatePickerModalProps {
  visible: boolean;
  currentValue: string; // YYYY-MM-DD or ""
  minDate: string; // YYYY-MM-DD
  onConfirm: (iso: string) => void;
  onCancel: () => void;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function parseISO(iso: string): {
  year: number;
  month: number;
  day: number;
} {
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

export function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_H)).current;

  const numDays = daysInMonth(selYear, selMonth);
  const days: number[] = Array.from({ length: numDays }, (_, i) => i + 1);

  // Clamp day when month/year changes
  useEffect(() => {
    const max = daysInMonth(selYear, selMonth);
    if (selDay > max) setSelDay(max);
  }, [selYear, selMonth]);

  // Animate in when visible becomes true
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(SHEET_H);
    }
  }, [visible]);

  function handleClose(cb: () => void) {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_H,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => cb());
  }

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
      animationType="none"
      onRequestClose={() => handleClose(onCancel)}
    >
      <View style={dp.overlay}>
        <Pressable style={{ flex: 1 }} onPress={() => handleClose(onCancel)}>
          <Animated.View style={[dp.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View
          style={[dp.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        >
          {/* Header */}
          <View style={dp.header}>
            <ButtonGeneric
              handleBtn={() => handleClose(onCancel)}
              style={dp.headerBtn}
            >
              <Text style={dp.cancelText}>Annulla</Text>
            </ButtonGeneric>
            <Text style={dp.headerTitle}>Seleziona data</Text>
            <ButtonGeneric
              handleBtn={() =>
                handleClose(() => onConfirm(toISO(selYear, selMonth, selDay)))
              }
              style={dp.headerBtn}
            >
              <Text style={dp.confirmText}>Conferma</Text>
            </ButtonGeneric>
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
                snapToInterval={ITEM_H}
                decelerationRate="fast"
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
                snapToInterval={ITEM_H}
                decelerationRate="fast"
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
                snapToInterval={ITEM_H}
                decelerationRate="fast"
                onScrollToIndexFailed={() => {}}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
