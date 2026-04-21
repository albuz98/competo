import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { fps } from "./FilterPanel.styles";
import { colors } from "../../theme/colors";
import { GAMES } from "../../constants/generals";
import {
  TOURNAMENT_GENDERS,
  TournamentGender,
} from "../../constants/tournament";
import { RangeSlider } from "../core/RangeSlider/RangeSlider";
import { FilterState, SortOption } from "../../types/filters";
import { SORT_OPTIONS } from "../../constants/filters";

const { width: SW } = Dimensions.get("window");

interface FilterPanelProps {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export function FilterPanel({
  visible,
  filters,
  onClose,
  onApply,
}: FilterPanelProps) {
  const insets = useSafeAreaInsets();
  const panX = useRef(new Animated.Value(SW)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
      panX.setValue(SW);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 2,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, panX, overlayOpacity, filters]);

  const animateOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(panX, {
        toValue: SW,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      panX.setValue(SW);
      overlayOpacity.setValue(0);
      callback();
    });
  };

  const dismiss = () => animateOut(onClose);
  const handleApply = () => animateOut(() => onApply(draft));

  const toggleGame = (game: string) =>
    setDraft((d) => ({
      ...d,
      games: d.games.includes(game)
        ? d.games.filter((g) => g !== game)
        : [...d.games, game],
    }));

  const toggleGender = (gender: TournamentGender) =>
    setDraft((d) => ({
      ...d,
      genders: d.genders.includes(gender)
        ? d.genders.filter((g) => g !== gender)
        : [...d.genders, gender],
    }));

  const toggleSort = (sort: SortOption) =>
    setDraft((d) => ({ ...d, sortBy: d.sortBy === sort ? null : sort }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismiss}
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[fps.overlay, { opacity: overlayOpacity }]}
          onTouchEnd={dismiss}
        />
        <Animated.View
          style={[fps.panel, { transform: [{ translateX: panX }] }]}
        >
          {/* ── Header ────────────────────────────────── */}
          <View style={[fps.header, { paddingTop: insets.top + 24 }]}>
            <Text style={fps.headerTitle}>Filtri</Text>
            <TouchableOpacity style={fps.closeBtn} onPress={dismiss}>
              <Ionicons name="close" size={18} color={colors.dark} />
            </TouchableOpacity>
          </View>

          {/* ── Scrollable sections ───────────────────── */}
          <ScrollView
            style={fps.scroll}
            contentContainerStyle={fps.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={fps.sectionLabel}>Sport</Text>
            <View style={fps.chipsRow}>
              {GAMES.map((game) => {
                const active = draft.games.includes(game);
                return (
                  <TouchableOpacity
                    key={game}
                    style={[fps.chip, active && fps.chipActive]}
                    onPress={() => toggleGame(game)}
                    activeOpacity={0.8}
                  >
                    <Text style={[fps.chipText, active && fps.chipTextActive]}>
                      ⚽ {game}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={fps.sectionLabel}>Genere</Text>
            <View style={fps.chipsRow}>
              {TOURNAMENT_GENDERS.map(({ value, label, icon }) => {
                const active = draft.genders.includes(value);
                return (
                  <TouchableOpacity
                    key={value}
                    style={[fps.chip, active && fps.chipActive]}
                    onPress={() => toggleGender(value)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        icon as React.ComponentProps<typeof Ionicons>["name"]
                      }
                      size={14}
                      color={
                        active ? colors.primaryGradientMid : colors.placeholder
                      }
                    />
                    <Text style={[fps.chipText, active && fps.chipTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={fps.sectionLabel}>Fascia di prezzo</Text>
            <RangeSlider
              minValue={draft.minPrice}
              maxValue={draft.maxPrice}
              onChange={(min, max) =>
                setDraft((d) => ({ ...d, minPrice: min, maxPrice: max }))
              }
            />

            <View style={fps.divider} />

            <Text style={fps.sectionLabel}>Ordina per</Text>
            {SORT_OPTIONS.map(({ value, label, icon }) => {
              const active = draft.sortBy === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[fps.sortOption, active && fps.sortOptionActive]}
                  onPress={() => toggleSort(value)}
                  activeOpacity={0.8}
                >
                  <View style={fps.sortOptionLeft}>
                    <Ionicons
                      name={
                        icon as React.ComponentProps<typeof Ionicons>["name"]
                      }
                      size={18}
                      color={
                        active ? colors.primaryGradientMid : colors.placeholder
                      }
                    />
                    <Text
                      style={[
                        fps.sortOptionText,
                        active && fps.sortOptionTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primaryGradientMid}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Footer ────────────────────────────────── */}
          <View style={[fps.footer, { paddingBottom: insets.bottom + 24 }]}>
            <TouchableOpacity
              style={fps.applyBtn}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Text style={fps.applyBtnText}>Applica</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
