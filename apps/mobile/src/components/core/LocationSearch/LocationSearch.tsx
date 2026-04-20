import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { isMocking } from "../../../api/config";
import { colors, colorGradient } from "../../../theme/colors";
import { ls } from "./LocationSearch.styles";
import { searchNominatim } from "../../../api/searchLocation";
import { InputBoxSearch } from "../InputBoxSearch/InputBoxSearch";
import { Suggestion } from "../../../types/location";

interface LocationSearchProps {
  initialValue?: string;
  initialLat?: number;
  initialLng?: number;
  isConfirmed?: boolean;
  onConfirm: (address: string, lat?: number, lng?: number) => void;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

enum Mode {
  SEARCH = "search",
  PREVIEW = "preview",
  DONE = "done",
}

export default function LocationSearch({
  initialValue = "",
  initialLat,
  initialLng,
  isConfirmed = false,
  onConfirm,
  setLocation,
}: LocationSearchProps) {
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(
      isConfirmed && initialValue
        ? {
            displayName: initialValue,
            lat: initialLat ?? 0,
            lng: initialLng ?? 0,
          }
        : null,
    );
  const [mode, setMode] = useState<Mode>(
    isConfirmed && initialValue ? Mode.DONE : Mode.SEARCH,
  );

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setMode(Mode.PREVIEW);
  };

  const handleChange = () => {
    setMode(Mode.SEARCH);
    setSelectedSuggestion(null);
  };

  const handleConfirm = () => {
    if (!selectedSuggestion) return;
    setMode(Mode.DONE);
    onConfirm(
      selectedSuggestion.displayName,
      selectedSuggestion.lat,
      selectedSuggestion.lng,
    );
  };

  const handleClearDone = () => {
    setMode(Mode.SEARCH);
    setSelectedSuggestion(null);
    setLocation("");
  };

  // ── Preview: map + confirm/change buttons ───────────────────────────────────
  if (mode === Mode.PREVIEW && selectedSuggestion) {
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

  // ── Done: confirmed address display ────────────────────────────────────────
  if (mode === "done" && selectedSuggestion) {
    return (
      <View style={ls.container}>
        <View style={ls.confirmedRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={ls.confirmedText} numberOfLines={2}>
            {selectedSuggestion.displayName}
          </Text>
          <TouchableOpacity onPress={handleClearDone} hitSlop={8}>
            <Feather name="x" size={18} color={colors.placeholder} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Search: input + suggestions ────────────────────────────────────────────
  return (
    <View style={ls.container}>
      <InputBoxSearch<Suggestion>
        placeholder="Cerca indirizzo..."
        defaultValue={initialValue}
        onSearch={(q) => searchNominatim(q).then((r) => r.slice(0, 5))}
        onSelect={handleSelectSuggestion}
        onQueryChange={(q) => {
          if (q === "") setLocation("");
        }}
        minChars={isMocking ? 1 : 3}
        emptyMessage="Nessun risultato trovato"
        renderResult={(suggestion, index, onPress) => (
          <TouchableOpacity
            key={index}
            style={ls.suggestionItem}
            onPress={onPress}
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
        )}
      />
    </View>
  );
}
