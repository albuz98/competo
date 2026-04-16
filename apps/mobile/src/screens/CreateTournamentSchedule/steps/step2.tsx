import { View, Text } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { colors } from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  KO_FORMATS,
  PHASES,
  SINGLE_FORMATS,
  TournamentFormat,
  TournamentPhaseKind,
} from "../../../constants/tournament";
import { ButtonGeneric } from "../../../components/Button/Button";

interface renderStep2Props {
  phaseKind: TournamentPhaseKind;
  setPhaseKind: React.Dispatch<React.SetStateAction<TournamentPhaseKind>>;
  format: TournamentFormat;
  setFormat: React.Dispatch<React.SetStateAction<TournamentFormat>>;
  knockoutFormat: TournamentFormat;
  setKnockoutFormat: React.Dispatch<React.SetStateAction<TournamentFormat>>;
}

export function renderStep2({
  phaseKind,
  setPhaseKind,
  format,
  setFormat,
  knockoutFormat,
  setKnockoutFormat,
}: renderStep2Props) {
  function renderOptionCards<T extends string>(
    options: { value: T; label: string; sub: string; icon: string }[],
    selected: T,
    onSelect: (v: T) => void,
  ) {
    return options.map((opt) => (
      <ButtonGeneric
        key={opt.value}
        style={[s.optionCard, selected === opt.value && s.optionCardSelected]}
        handleBtn={() => onSelect(opt.value)}
      >
        <View
          style={[
            s.optionCardIcon,
            selected === opt.value && s.optionCardIconSelected,
          ]}
        >
          <Ionicons
            name={opt.icon as any}
            size={20}
            color={selected === opt.value ? colors.white : colors.placeholder}
          />
        </View>
        <View style={s.optionCardBody}>
          <Text style={s.optionCardTitle}>{opt.label}</Text>
          <Text style={s.optionCardSub}>{opt.sub}</Text>
        </View>
        <View
          style={[
            s.optionCardCheck,
            selected === opt.value && s.optionCardCheckSelected,
          ]}
        >
          {selected === opt.value && (
            <Ionicons name="checkmark" size={13} color={colors.white} />
          )}
        </View>
      </ButtonGeneric>
    ));
  }

  return (
    <>
      <Text style={s.sectionTitle}>Struttura Torneo</Text>
      <Text style={s.sectionSub}>
        Scegli come si svolge il torneo. Potrai aggiungere le squadre nel passo
        successivo.
      </Text>

      <Text style={s.sectionLabel}>Struttura</Text>
      {renderOptionCards(PHASES, phaseKind, (v) => setPhaseKind(v))}

      {phaseKind === "single" && (
        <>
          <Text style={[s.sectionLabel, { marginTop: 20 }]}>Formula</Text>
          {renderOptionCards(SINGLE_FORMATS, format, (v) => setFormat(v))}
        </>
      )}

      {phaseKind === "multi" && (
        <>
          <Text style={[s.sectionLabel, { marginTop: 20 }]}>Fase gironi</Text>
          <View
            style={[
              s.optionCard,
              {
                borderColor: colors.primaryGradientMid,
                backgroundColor: colors.primarySelectedBg,
              },
            ]}
          >
            <View style={[s.optionCardIcon, s.optionCardIconSelected]}>
              <Ionicons
                name="refresh-circle-outline"
                size={20}
                color={colors.white}
              />
            </View>
            <View style={s.optionCardBody}>
              <Text style={s.optionCardTitle}>Girone all'italiana</Text>
              <Text style={s.optionCardSub}>
                Ogni squadra affronta tutte le altre nel proprio girone
              </Text>
            </View>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={colors.primary}
            />
          </View>

          <Text style={[s.sectionLabel, { marginTop: 20 }]}>
            Fase ad eliminazione
          </Text>
          {renderOptionCards(KO_FORMATS, knockoutFormat, (v) =>
            setKnockoutFormat(v),
          )}

          <View style={s.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={colors.primaryGradientMid}
            />
            <Text style={s.infoBoxText}>
              I gironi si giocano prima. Le prime classificate di ogni girone
              avanzano alla fase ad eliminazione selezionata.
            </Text>
          </View>
        </>
      )}
    </>
  );
}
