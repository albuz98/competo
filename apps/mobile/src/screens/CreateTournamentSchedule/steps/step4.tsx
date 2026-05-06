import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Stepper } from "../../../components/core/Stepper/Stepper";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { TournamentPhaseKind } from "../../../constants/tournament";

export interface PhaseSettings {
  twoHalves: boolean;
  setTwoHalves: React.Dispatch<React.SetStateAction<boolean>>;
  halfDuration: number;
  setHalfDuration: React.Dispatch<React.SetStateAction<number>>;
  halfBreak: number;
  setHalfBreak: React.Dispatch<React.SetStateAction<number>>;
  timeBetween: number;
  setTimeBetween: React.Dispatch<React.SetStateAction<number>>;
  tempoEffettivo: boolean;
  setTempoEffettivo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface renderStep4Props {
  numFields: number;
  setNumFields: React.Dispatch<React.SetStateAction<number>>;
  numTeams: number;
  phaseKind: TournamentPhaseKind;
  gironi: PhaseSettings;
  finale: PhaseSettings;
}

function PhaseSettingsPanel({
  settings,
  accentColor,
}: {
  settings: PhaseSettings;
  accentColor: string;
}) {
  const totalDuration = settings.twoHalves
    ? settings.halfDuration * 2 + settings.halfBreak
    : settings.halfDuration;

  return (
    <View style={{ gap: 0 }}>
      <Text style={[s.sectionLabel, { marginTop: 12 }]}>Struttura partita</Text>
      <View style={s.halfToggleRow}>
        <TouchableOpacity
          style={[
            s.halfToggleBtn,
            !settings.twoHalves && {
              borderColor: accentColor,
              backgroundColor: accentColor + "18",
            },
          ]}
          onPress={() => settings.setTwoHalves(false)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              s.halfToggleBtnText,
              !settings.twoHalves && { color: accentColor },
            ]}
          >
            Tempo unico
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            s.halfToggleBtn,
            settings.twoHalves && {
              borderColor: accentColor,
              backgroundColor: accentColor + "18",
            },
          ]}
          onPress={() => settings.setTwoHalves(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              s.halfToggleBtnText,
              settings.twoHalves && { color: accentColor },
            ]}
          >
            2 Tempi
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.numberInputRow}>
        <Text style={s.fieldLabel}>
          Durata {settings.twoHalves ? "singolo tempo" : "partita"}
        </Text>
        <View style={s.fieldMinInput}>
          <InputBox
            value={String(settings.halfDuration)}
            onChangeText={(v) => settings.setHalfDuration(parseInt(v, 10) || 0)}
            keyboardType="number-pad"
            placeholder=""
            isDark={false}
            isBorderless
          />
          <Text style={s.numberInputSuffix}>min</Text>
        </View>
      </View>

      {settings.twoHalves && (
        <View style={s.numberInputRow}>
          <Text style={s.fieldLabel}>Durata intervallo</Text>
          <View style={s.fieldMinInput}>
            <InputBox
              value={String(settings.halfBreak)}
              onChangeText={(v) => settings.setHalfBreak(parseInt(v, 10) || 0)}
              keyboardType="number-pad"
              placeholder=""
              isDark={false}
              isBorderless
            />
            <Text style={s.numberInputSuffix}>min</Text>
          </View>
        </View>
      )}

      <View style={s.numberInputRow}>
        <Text style={s.fieldLabel}>Tempo tra le partite</Text>
        <View style={s.fieldMinInput}>
          <InputBox
            value={String(settings.timeBetween)}
            onChangeText={(v) => settings.setTimeBetween(parseInt(v, 10) || 0)}
            keyboardType="number-pad"
            placeholder=""
            isDark={false}
            isBorderless
          />
          <Text style={s.numberInputSuffix}>min</Text>
        </View>
      </View>

      <View style={s.toggleRow}>
        <View>
          <Text style={s.toggleLabel}>Tempo effettivo</Text>
          <Text style={s.toggleSub}>
            Il cronometro si ferma a gioco fermo
          </Text>
        </View>
        <Switch
          value={settings.tempoEffettivo}
          onValueChange={settings.setTempoEffettivo}
          trackColor={{
            false: colors.disabled,
            true: colors.primaryGradientMid,
          }}
          thumbColor={colors.white}
        />
      </View>

      <View style={[s.infoBox, { marginBottom: 4 }]}>
        <Ionicons name="time-outline" size={16} color={colors.primary} />
        <Text style={s.infoBoxText}>
          Durata partita: {totalDuration} min · Slot totale:{" "}
          {totalDuration + settings.timeBetween} min
        </Text>
      </View>
    </View>
  );
}

export function renderStep4({
  numFields,
  setNumFields,
  numTeams,
  phaseKind,
  gironi,
  finale,
}: renderStep4Props) {
  const minFieldsNeeded = Math.floor(numTeams / 2);
  const fieldsWarning = numFields < minFieldsNeeded;
  const isMulti = phaseKind === TournamentPhaseKind.MULTI;

  return (
    <>
      <Text style={s.sectionTitle}>Logistica</Text>
      <Text style={s.sectionSub}>
        Configura campi disponibili e durata degli incontri.
      </Text>

      <Text style={s.sectionLabel}>Numero campi</Text>
      <View style={s.fieldRow}>
        <View style={s.optionCardBody}>
          <Text style={s.fieldLabel}>Campi disponibili</Text>
          <Text style={s.fieldSub}>Partite simultanee per turno</Text>
        </View>
        <Stepper value={numFields} min={1} max={20} onChange={setNumFields} />
      </View>

      {fieldsWarning && (
        <View style={s.warningBox}>
          <Ionicons
            name="warning-outline"
            size={18}
            color={colors.primaryGradientMid}
          />
          <Text style={s.warningBoxText}>
            Con {numTeams} squadre servirebbero {minFieldsNeeded} campi per
            turni completamente simultanei. I turni verranno spezzati in
            sotto-turni.
          </Text>
        </View>
      )}

      <Text style={s.sectionLabel}>
        {isMulti ? "Impostazioni fasi" : "Impostazioni partite"}
      </Text>

      <View style={[s.phaseSection, { borderLeftColor: colors.primary }]}>
        <View style={s.phaseSectionHeader}>
          <Text style={s.phaseSectionTitle}>
            {isMulti ? "Gironi" : "Partite"}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <PhaseSettingsPanel settings={gironi} accentColor={colors.primary} />
        </View>
      </View>

      {isMulti && (
        <View style={[s.phaseSection, { borderLeftColor: colors.purpleBlue }]}>
          <View style={s.phaseSectionHeader}>
            <Text style={s.phaseSectionTitle}>Fase Finale</Text>
          </View>
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <PhaseSettingsPanel
              settings={finale}
              accentColor={colors.purpleBlue}
            />
          </View>
        </View>
      )}
    </>
  );
}
