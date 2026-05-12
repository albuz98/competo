import React from "react";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { s } from "../CreateRefereeProfile.styles";
import { colors } from "../../../theme/colors";
import {
  REFEREE_RATE_TYPES,
  REFEREE_HOUR_RANGES,
  REFEREE_MAX_DISTANCES,
  type RefereeRateType,
} from "../../../constants/referee";

type Props = {
  baseRate: string;
  setBaseRate: (v: string) => void;
  rateType: RefereeRateType;
  setRateType: (v: RefereeRateType) => void;
  travelAvailable: boolean;
  setTravelAvailable: (v: boolean) => void;
  travelRatePerKm: string;
  setTravelRatePerKm: (v: string) => void;
  maxTravelKm: number | null;
  setMaxTravelKm: (v: number | null) => void;
  consecutiveHoursRange: string | null;
  setConsecutiveHoursRange: (v: string | null) => void;
};

export function Step4({
  baseRate,
  setBaseRate,
  rateType,
  setRateType,
  travelAvailable,
  setTravelAvailable,
  travelRatePerKm,
  setTravelRatePerKm,
  maxTravelKm,
  setMaxTravelKm,
  consecutiveHoursRange,
  setConsecutiveHoursRange,
}: Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Tariffe & Disponibilità</Text>
      <Text style={s.sectionSub}>
        Indica la tua tariffa base, le condizioni per le trasferte e quante ore
        consecutive sei disponibile ad arbitrare.
      </Text>

      {/* Tariffa base */}
      <InputBox
        value={baseRate}
        onChangeText={(v) => setBaseRate(v.replace(/[^0-9.]/g, ""))}
        placeholder="Es. 30"
        isDark={false}
        labelName="Tariffa base (€)"
        isObbligatory
        keyboardType="decimal-pad"
      />

      <Text style={[s.sectionLabel, { marginTop: 12 }]}>
        La tariffa è da considerarsi *
      </Text>
      <View style={s.segmentedRow}>
        {REFEREE_RATE_TYPES.map(({ label, value }) => {
          const active = rateType === value;
          return (
            <Pressable
              key={value}
              style={[s.segmentedItem, active && s.segmentedItemActive]}
              onPress={() => setRateType(value)}
            >
              <Text style={[s.segmentedText, active && s.segmentedTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Trasferta */}
      <Text style={[s.sectionLabel, { marginTop: 4 }]}>
        Disponibile a trasferte? *
      </Text>
      <View style={s.segmentedRow}>
        {(["Sì", "No"] as const).map((opt) => {
          const active =
            (opt === "Sì" && travelAvailable) ||
            (opt === "No" && !travelAvailable);
          return (
            <Pressable
              key={opt}
              style={[s.segmentedItem, active && s.segmentedItemActive]}
              onPress={() => setTravelAvailable(opt === "Sì")}
            >
              <Text style={[s.segmentedText, active && s.segmentedTextActive]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {travelAvailable && (
        <>
          <InputBox
            value={travelRatePerKm}
            onChangeText={(v) => setTravelRatePerKm(v.replace(/[^0-9.]/g, ""))}
            placeholder="Es. 0.30"
            isDark={false}
            labelName="Costo aggiuntivo per km di trasferta (€/km)"
            isObbligatory
            keyboardType="decimal-pad"
          />
          <View style={s.hintBox}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.placeholder}
            />
            <Text style={s.hintBoxText}>
              Verrà sommato alla tariffa base in proporzione alla distanza
              dall'evento.
            </Text>
          </View>

          <Text style={[s.sectionLabel, { marginTop: 16 }]}>
            Distanza massima per trasferta *
          </Text>
          <View style={s.chipsRow}>
            {REFEREE_MAX_DISTANCES.map(({ label, value }) => {
              const active = maxTravelKm === value;
              return (
                <Pressable
                  key={value}
                  style={[s.chip, active && s.chipSelected]}
                  onPress={() => setMaxTravelKm(active ? null : value)}
                >
                  <Text style={[s.chipText, active && s.chipTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {/* Ore consecutive */}
      <Text style={[s.sectionLabel, { marginTop: 16 }]}>
        Ore consecutive massime *
      </Text>
      <View style={[s.hintBox, { marginBottom: 8 }]}>
        <Ionicons
          name="information-circle-outline"
          size={15}
          color={colors.placeholder}
        />
        <Text style={s.hintBoxText}>
          Range di ore di fila che puoi arbitrare prima di aver bisogno di una
          pausa.
        </Text>
      </View>
      <View style={s.chipsRow}>
        {REFEREE_HOUR_RANGES.map(({ label, value }) => {
          const active = consecutiveHoursRange === value;
          return (
            <Pressable
              key={value}
              style={[s.chip, active && s.chipSelected]}
              onPress={() =>
                setConsecutiveHoursRange(active ? null : value)
              }
            >
              <Text style={[s.chipText, active && s.chipTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={s.infoBox}>
        <Ionicons name="cash-outline" size={18} color={colors.darkBlue} />
        <Text style={s.infoBoxText}>
          Le tariffe sono indicative. L'organizzatore potrà vedere i tuoi
          parametri e contattarti per concordare i dettagli finali.
        </Text>
      </View>
    </>
  );
}
