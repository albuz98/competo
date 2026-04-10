import { View, Text } from "react-native";
import InputBox from "../../../components/InputBox/InputBox";
import { Stepper } from "../../../components/Stepper/Stepper";
import { Ionicons } from "@expo/vector-icons";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";

interface renderStep4Props {
  numFields: number;
  setNumFields: React.Dispatch<React.SetStateAction<number>>;
  matchDuration: number;
  setMatchDuration: React.Dispatch<React.SetStateAction<number>>;
  restMinutes: number;
  setRestMinutes: React.Dispatch<React.SetStateAction<number>>;
  travelMinutes: number;
  setTravelMinutes: React.Dispatch<React.SetStateAction<number>>;
  numTeams: number;
}

export function renderStep4({
  numFields,
  setNumFields,
  setMatchDuration,
  setRestMinutes,
  setTravelMinutes,
  numTeams,
  matchDuration,
  restMinutes,
  travelMinutes,
}: renderStep4Props) {
  const minFieldsNeeded = Math.floor(numTeams / 2);
  const fieldsWarning = numFields < minFieldsNeeded;

  return (
    <>
      <Text style={s.sectionTitle}>Logistica Campi</Text>
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

      <Text style={s.sectionLabel}>Durata e tempi</Text>
      <View style={s.numberInputRow}>
        <Text style={s.fieldLabel}>Durata incontro</Text>
        <View style={s.fieldMinInput}>
          <InputBox
            style={s.numberInput}
            value={String(matchDuration)}
            onChangeText={(v) => setMatchDuration(parseInt(v, 10) || 0)}
            keyboardType="number-pad"
            placeholder=""
            isDark={false}
          />
          <Text style={(s.numberInputSuffix, { color: "black" })}>min</Text>
        </View>
      </View>

      <View style={s.numberInputRow}>
        <View>
          <Text style={s.fieldLabel}>Tempo di riposo</Text>
          <Text style={s.fieldSub}>Dopo ogni partita</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <InputBox
            style={s.numberInput}
            value={String(restMinutes)}
            onChangeText={(v) => setRestMinutes(parseInt(v, 10) || 0)}
            keyboardType="number-pad"
            placeholder=""
            isDark={false}
          />
          <Text style={s.numberInputSuffix}>min</Text>
        </View>
      </View>

      <View style={s.numberInputRow}>
        <View>
          <Text style={s.fieldLabel}>Spostamento tra campi</Text>
          <Text style={s.fieldSub}>Tempo per cambiare campo</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <InputBox
            style={s.numberInput}
            value={String(travelMinutes)}
            onChangeText={(v) => setTravelMinutes(parseInt(v, 10) || 0)}
            keyboardType="number-pad"
            placeholder=""
            isDark={false}
          />
          <Text style={s.numberInputSuffix}>min</Text>
        </View>
      </View>

      <View style={s.infoBox}>
        <Ionicons name="time-outline" size={18} color={colors.primary} />
        <Text style={s.infoBoxText}>
          Intervallo totale tra partite: {restMinutes + travelMinutes} min. Slot
          per squadra ogni {matchDuration + restMinutes + travelMinutes} min.
        </Text>
      </View>
    </>
  );
}
