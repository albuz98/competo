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
import { colors, colorGradient } from "../../theme/colors";
import { s } from "./InputBoxSearch.styles";

interface InputBoxSearchProps<T> {
  placeholder?: string;
  /** Pre-fills the input on mount */
  defaultValue?: string;
  /** Async function that receives the trimmed query and returns results */
  onSearch: (query: string) => Promise<T[]>;
  /** Render each result item; call onPress to notify the parent */
  renderResult: (item: T, index: number, onPress: () => void) => React.ReactNode;
  /** Called when the user taps a result */
  onSelect?: (item: T) => void;
  /** Called on every query change (including clear) */
  onQueryChange?: (query: string) => void;
  /** Show the orange gradient icon bubble on the left (like in Home). Default: plain search icon */
  gradientIcon?: boolean;
  /** Debounce delay in ms. Default: 500 */
  debounceMs?: number;
  /** Minimum characters before the search fires. Default: 1 */
  minChars?: number;
  /** Dark-mode background (like InputBox). Default: false (white) */
  isDark?: boolean;
  /** Highlight input border in red */
  isError?: boolean;
  /** Message shown when the search returns no results */
  emptyMessage?: string;
  /**
   * Overlay mode: renders a fake (non-interactive) bar; tapping it opens a
   * transparent full-screen Modal that contains the real input + results.
   * The Modal covers the tab bar too. Default: false (inline rendering).
   */
  overlayDropdown?: boolean;
  /**
   * Extra top spacing inside the Modal search area, in addition to safe-area
   * insets. Should match the marginTop of the wrapping View in the screen.
   * Default: 20
   */
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
  // debouncedQuery is what actually drives the useQuery
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue?.trim() ?? "");
  const [modalVisible, setModalVisible] = useState(false);

  // Unique key per component instance so different search boxes don't share cache
  const instanceId = useRef(`ibsearch-${Math.random().toString(36).slice(2)}`).current;

  // Debounce: update debouncedQuery after the user stops typing
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(trimmed), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs, minChars]);

  const { data: results = [], isFetching: isSearching, isSuccess } = useQuery({
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
            <Ionicons name="search-outline" size={18} color={colors.placeholder} />
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
                  style={[s.input, { color: isDark ? colors.white : colors.dark }]}
                  value={query}
                  onChangeText={handleQueryChange}
                  placeholder={placeholder}
                  placeholderTextColor={isDark ? colors.grayOpacized : colors.placeholder}
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
                  {results.slice(0, 5).map((item, index) =>
                    renderResult(item, index, () => handleSelect(item))
                  )}
                </View>
              )}

              {showEmpty && (
                <Text style={[s.emptyText, s.resultsModalSpacing]}>{emptyMessage}</Text>
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
          style={[
            s.input,
            { color: isDark ? colors.white : colors.dark },
          ]}
          value={query}
          onChangeText={handleQueryChange}
          placeholder={placeholder}
          placeholderTextColor={isDark ? colors.grayOpacized : colors.placeholder}
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
            renderResult(item, index, () => handleSelect(item))
          )}
        </View>
      )}

      {showEmpty && (
        <Text style={s.emptyText}>{emptyMessage}</Text>
      )}
    </View>
  );
}
