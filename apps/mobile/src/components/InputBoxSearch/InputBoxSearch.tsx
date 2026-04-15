import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { colors, colorGradient } from "../../theme/colors";
import { s } from "./InputBoxSearch.styles";

interface InputBoxSearchProps<T> {
  placeholder?: string;
  /** Async function that receives the trimmed query and returns results */
  onSearch: (query: string) => Promise<T[]>;
  /** Render each result item; call onPress to notify the parent */
  renderResult: (item: T, index: number, onPress: () => void) => React.ReactNode;
  /** Called when the user taps a result */
  onSelect?: (item: T) => void;
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
}

export function InputBoxSearch<T>({
  placeholder = "Cerca...",
  onSearch,
  renderResult,
  onSelect,
  gradientIcon = false,
  debounceMs = 500,
  minChars = 1,
  isDark = false,
  isError = false,
  emptyMessage,
}: InputBoxSearchProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether a search has been attempted (to decide when to show emptyMessage)
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    const trimmed = query.trim();

    if (trimmed.length < minChars) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);

    debounceTimer.current = setTimeout(() => {
      onSearch(trimmed)
        .then((res) => {
          setResults(res);
          setHasSearched(true);
        })
        .catch(() => {
          setResults([]);
          setHasSearched(true);
        })
        .finally(() => setIsSearching(false));
    }, debounceMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const handleSelect = (item: T) => {
    onSelect?.(item);
  };

  const showEmpty =
    !isSearching &&
    hasSearched &&
    results.length === 0 &&
    !!emptyMessage;

  return (
    <View style={s.container}>
      <View
        style={[
          s.inputRow,
          isError && s.inputRowError,
          { backgroundColor: isDark ? colors.opacized : colors.white },
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
          onChangeText={setQuery}
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
