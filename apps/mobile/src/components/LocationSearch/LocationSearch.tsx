import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { isMocking } from "../../api/config";
import { colors, colorGradient } from "../../theme/colors";
import { ls } from "./LocationSearch.styles";
import InputBox from "../InputBox/InputBox";

type Suggestion = {
  displayName: string;
  lat: number;
  lng: number;
};

interface LocationSearchProps {
  initialValue?: string;
  onConfirm: (address: string, lat?: number, lng?: number) => void;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    displayName: "Centro Sportivo Milano Nord, Via Testi 10, Milano",
    lat: 45.518,
    lng: 9.185,
  },
  {
    displayName: "Parco Sport Roma Tre Fontane, Via delle Tre Fontane, Roma",
    lat: 41.837,
    lng: 12.464,
  },
  {
    displayName: "Campo Calcio Napoli Est, Corso Malta 45, Napoli",
    lat: 40.853,
    lng: 14.287,
  },
  {
    displayName: "Stadio Comunale Torino Sud, Via Druento 15, Torino",
    lat: 45.063,
    lng: 7.663,
  },
  {
    displayName: "Centro Polisportivo Firenze, Piazzale dello Sport, Firenze",
    lat: 43.78,
    lng: 11.226,
  },
  {
    displayName: "Impianti Sportivi Bologna, Via Arcoveggio 50, Bologna",
    lat: 44.523,
    lng: 11.345,
  },
  {
    displayName: "Arena Sportiva Palermo, Via Ugo La Malfa 32, Palermo",
    lat: 38.107,
    lng: 13.341,
  },
];

async function searchMock(query: string): Promise<Suggestion[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 300));
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_SUGGESTIONS;
  return MOCK_SUGGESTIONS.filter((s) =>
    s.displayName.toLowerCase().includes(q),
  );
}

async function searchNominatim(query: string): Promise<Suggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return (data as any[]).map((item) => ({
    displayName: item.display_name as string,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
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
    const searchFn = isMocking ? searchMock : searchNominatim;
    searchFn(q)
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
