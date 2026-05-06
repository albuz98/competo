import { View, Text, TouchableOpacity } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  TOURNAMENT_MODES,
  TournamentMode,
} from "../../../constants/tournament";
import { ButtonGeneric } from "../../../components/core/Button/Button";

interface renderStep2Props {
  tournamentMode: TournamentMode;
  setTournamentMode: React.Dispatch<React.SetStateAction<TournamentMode>>;
  campionatoDoubleRound: boolean;
  setCampionatoDoubleRound: React.Dispatch<React.SetStateAction<boolean>>;
}

export function renderStep2({
  tournamentMode,
  setTournamentMode,
  campionatoDoubleRound,
  setCampionatoDoubleRound,
}: renderStep2Props) {
  return (
    <>
      <Text style={s.sectionTitle}>Struttura Torneo</Text>
      <Text style={s.sectionSub}>
        Scegli il formato del torneo. Potrai aggiungere le squadre nel passo
        successivo.
      </Text>

      <Text style={s.sectionLabel}>Formato</Text>
      {TOURNAMENT_MODES.map((opt) => (
        <ButtonGeneric
          key={opt.value}
          style={[
            s.optionCard,
            tournamentMode === opt.value && s.optionCardSelected,
          ]}
          handleBtn={() => setTournamentMode(opt.value)}
        >
          <View
            style={[
              s.optionCardIcon,
              tournamentMode === opt.value && s.optionCardIconSelected,
            ]}
          >
            <Ionicons
              name={opt.icon as any}
              size={20}
              color={
                tournamentMode === opt.value ? colors.white : colors.placeholder
              }
            />
          </View>
          <View style={s.optionCardBody}>
            <Text style={s.optionCardTitle}>{opt.label}</Text>
            <Text style={s.optionCardSub}>{opt.sub}</Text>
          </View>
          <View
            style={[
              s.optionCardCheck,
              tournamentMode === opt.value && s.optionCardCheckSelected,
            ]}
          >
            {tournamentMode === opt.value && (
              <Ionicons name="checkmark" size={13} color={colors.white} />
            )}
          </View>
        </ButtonGeneric>
      ))}

      {tournamentMode === TournamentMode.CAMPIONATO && (
        <>
          <Text style={s.sectionLabel}>Gare</Text>
          <View style={s.halfToggleRow}>
            <TouchableOpacity
              style={[
                s.halfToggleBtn,
                campionatoDoubleRound && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "18",
                },
              ]}
              onPress={() => setCampionatoDoubleRound(true)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  s.halfToggleBtnText,
                  campionatoDoubleRound && { color: colors.primary },
                ]}
              >
                Andata e Ritorno
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.halfToggleBtn,
                !campionatoDoubleRound && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + "18",
                },
              ]}
              onPress={() => setCampionatoDoubleRound(false)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  s.halfToggleBtnText,
                  !campionatoDoubleRound && { color: colors.primary },
                ]}
              >
                Solo Andata
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}
