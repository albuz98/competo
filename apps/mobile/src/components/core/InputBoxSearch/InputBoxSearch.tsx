import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import { colors, colorGradient } from "../../../theme/colors";
import { s } from "./InputBoxSearch.styles";

interface InputBoxSearchProps<T> {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => Promise<T[]>;
  renderResult: (
    item: T,
    index: number,
    onPress: () => void,
  ) => React.ReactNode;
  onSelect?: (item: T) => void;
  onQueryChange?: (query: string) => void;
  gradientIcon?: boolean;
  debounceMs?: number;
  minChars?: number;
  isDark?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  overlayDropdown?: boolean;
  modalTopSpacing?: number;
}

export function InputBoxSearch<T>({
  placeholder = "Cerca...",
  defaultValue,
  onSearch,
  renderResult,
  onSelect,
  onQueryChange,
  gradientIcon = false,
  debounceMs = 500,
  minChars = 1,
  isDark = false,
  isError = false,
  emptyMessage,
  overlayDropdown = false,
  modalTopSpacing = 20,
}: InputBoxSearchProps<T>) {
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState(defaultValue ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(
    defaultValue?.trim() ?? "",
  );
  const [modalVisible, setModalVisible] = useState(false);

  const instanceId = useRef(
    `ibsearch-${Math.random().toString(36).slice(2)}`,
  ).current;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(trimmed), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs, minChars]);

  const {
    data: results = [],
    isFetching: isSearching,
    isSuccess,
  } = useQuery({
    queryKey: [instanceId, debouncedQuery],
    queryFn: () => onSearch(debouncedQuery),
    enabled: debouncedQuery.length >= minChars,
    staleTime: 30_000, // avoid redundant refetches for the same query
  });

  const hasSearched = isSuccess && debouncedQuery.length >= minChars;

  const handleQueryChange = (text: string) => {
    setQuery(text);
    onQueryChange?.(text);
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    onQueryChange?.("");
    if (overlayDropdown) setModalVisible(false);
  };

  const handleSelect = (item: T) => {
    onSelect?.(item);
    if (overlayDropdown) {
      setQuery("");
      setDebouncedQuery("");
      onQueryChange?.("");
      setModalVisible(false);
    }
  };

  const showEmpty =
    !isSearching && hasSearched && results.length === 0 && !!emptyMessage;

  const inputBg = isDark ? colors.opacized : colors.white;

  // ── Overlay (modal) mode ──────────────────────────────────────────────────
  if (overlayDropdown) {
    return (
      <View style={s.container}>
        {/* Fake bar — tapping opens the modal */}
        <TouchableOpacity
          style={[s.inputRow, { backgroundColor: inputBg }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={1}
        >
          {gradientIcon ? (
            <LinearGradient
              colors={colorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.gradientIconWrap}
            >
              <Ionicons name="search" size={15} color={colors.white} />
            </LinearGradient>
          ) : (
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.placeholder}
            />
          )}
          <Text style={s.fakePlaceholder} numberOfLines={1}>
            {placeholder}
          </Text>
        </TouchableOpacity>

        {/* Transparent full-screen Modal — covers tab bar */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={handleClear}
        >
          <View style={StyleSheet.absoluteFillObject}>
            {/* Dim overlay — visible only after first character, tap to dismiss */}
            <TouchableWithoutFeedback onPress={handleClear}>
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  query.length >= 1 && s.dimOverlay,
                ]}
              />
            </TouchableWithoutFeedback>

            {/* Search area — same visual position as the real bar */}
            <View
              style={[
                s.modalSearchWrap,
                { paddingTop: insets.top + modalTopSpacing },
              ]}
              pointerEvents="box-none"
            >
              {/* Real input row */}
              <View style={[s.inputRow, { backgroundColor: inputBg }]}>
                {gradientIcon ? (
                  <LinearGradient
                    colors={colorGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={s.gradientIconWrap}
                  >
                    <Ionicons name="search" size={15} color={colors.white} />
                  </LinearGradient>
                ) : (
                  <Ionicons
                    name="search-outline"
                    size={18}
                    color={colors.placeholder}
                  />
                )}

                <TextInput
                  style={[
                    s.input,
                    { color: isDark ? colors.white : colors.dark },
                  ]}
                  value={query}
                  onChangeText={handleQueryChange}
                  placeholder={placeholder}
                  placeholderTextColor={
                    isDark ? colors.grayOpacized : colors.placeholder
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="search"
                  autoFocus
                />

                {isSearching && (
                  <ActivityIndicator size="small" color={colors.primary} />
                )}

                {!isSearching && query.length > 0 && (
                  <TouchableOpacity onPress={handleClear} style={s.clearBtn}>
                    <Feather name="x" size={18} color={colors.placeholder} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Results — max 5 */}
              {!isSearching && results.length > 0 && (
                <View style={[s.resultsList, s.resultsModalSpacing]}>
                  {results
                    .slice(0, 5)
                    .map((item, index) =>
                      renderResult(item, index, () => handleSelect(item)),
                    )}
                </View>
              )}

              {showEmpty && (
                <Text style={[s.emptyText, s.resultsModalSpacing]}>
                  {emptyMessage}
                </Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ── Inline mode (default) ────────────────────────────────────────────────
  return (
    <View style={s.container}>
      <View
        style={[
          s.inputRow,
          isError && s.inputRowError,
          { backgroundColor: inputBg },
        ]}
      >
        {gradientIcon ? (
          <LinearGradient
            colors={colorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.gradientIconWrap}
          >
            <Ionicons name="search" size={15} color={colors.white} />
          </LinearGradient>
        ) : (
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.placeholder}
          />
        )}

        <TextInput
          style={[s.input, { color: isDark ? colors.white : colors.dark }]}
          value={query}
          onChangeText={handleQueryChange}
          placeholder={placeholder}
          placeholderTextColor={
            isDark ? colors.grayOpacized : colors.placeholder
          }
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {isSearching && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {!isSearching && query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={s.clearBtn}>
            <Feather name="x" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        )}
      </View>

      {!isSearching && results.length > 0 && (
        <View style={s.resultsList}>
          {results.map((item, index) =>
            renderResult(item, index, () => handleSelect(item)),
          )}
        </View>
      )}

      {showEmpty && <Text style={s.emptyText}>{emptyMessage}</Text>}
    </View>
  );
}
