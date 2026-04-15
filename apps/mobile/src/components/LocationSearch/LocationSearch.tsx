import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { isMocking } from "../../api/config";
import { colors, colorGradient } from "../../theme/colors";
import { ls } from "./LocationSearch.styles";
import { searchNominatim } from "../../api/searchLocation";
import { Suggestion } from "../../types";

interface LocationSearchProps {
  initialValue?: string;
  onConfirm: (address: string, lat?: number, lng?: number) => void;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

type Mode = "search" | "preview" | "done";

export default function LocationSearch({
  initialValue = "",
  onConfirm,
  setLocation,
}: LocationSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [mode, setMode] = useState<Mode>("search");

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = (q: string) => {
    setIsSearching(true);
    searchNominatim(q)
      .then((results) => {
        setSuggestions(results.slice(0, 5));
      })
      .catch(() => {
        setSuggestions([]);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  useEffect(() => {
    if (mode !== "search") return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmed = query.trim();

    // Empty input → clear and don't search
    if (trimmed.length === 0) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Real Nominatim requires ≥3 chars to avoid rate-limiting on trivial queries
    if (!isMocking && trimmed.length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      runSearch(query);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, mode]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setMode("preview");
  };

  const handleChange = () => {
    setMode("search");
    setSelectedSuggestion(null);
    setSuggestions([]);
  };

  const handleConfirm = () => {
    if (!selectedSuggestion) return;
    setMode("done");
    setQuery(selectedSuggestion.displayName);
    onConfirm(
      selectedSuggestion.displayName,
      selectedSuggestion.lat,
      selectedSuggestion.lng,
    );
  };

  if (mode === "preview" && selectedSuggestion) {
    return (
      <View style={ls.container}>
        <View style={ls.selectedAddressBox}>
          <Text style={ls.selectedAddressText}>
            {selectedSuggestion.displayName}
          </Text>
        </View>

        <MapView
          style={ls.mapPreview}
          scrollEnabled={false}
          pointerEvents="none"
          region={{
            latitude: selectedSuggestion.lat,
            longitude: selectedSuggestion.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: selectedSuggestion.lat,
              longitude: selectedSuggestion.lng,
            }}
          />
        </MapView>

        <View style={ls.btnRow}>
          <TouchableOpacity style={ls.btnChange} onPress={handleChange}>
            <Text style={ls.btnChangeText}>Cambia</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ls.btnConfirm} onPress={handleConfirm}>
            <LinearGradient
              colors={colorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={ls.btnConfirmInner}
            >
              <Text style={ls.btnConfirmText}>Conferma</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={ls.container}>
      <InputBox
        value={query}
        onChangeText={(e) => {
          setQuery(e);
          setSuggestions([]);
        }}
        placeholder="Cerca indirizzo..."
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        deleteText={
          query.length > 0
            ? () => {
                setQuery("");
                setMode("search");
                setSuggestions([]);
                setSelectedSuggestion(null);
                setLocation("");
              }
            : undefined
        }
        isDark={false}
      />

      {isSearching && (
        <View style={ls.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={ls.loadingText}>Ricerca in corso...</Text>
        </View>
      )}

      {!isSearching &&
        mode !== "done" &&
        suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              ls.suggestionItem,
              selectedSuggestion?.displayName === suggestion.displayName &&
                ls.suggestionItemSelected,
            ]}
            onPress={() => handleSelectSuggestion(suggestion)}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.placeholder}
            />
            <Text style={ls.suggestionText} numberOfLines={2}>
              {suggestion.displayName}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}
