import { View, Text, TouchableOpacity } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { Stepper } from "../../../components/core/Stepper/Stepper";
import { InputBox } from "../../../components/core/InputBox/InputBox";
import { estimateTotalMatches } from "../../../functions/tournamet";
import {
  TournamentFormat,
  TournamentPhaseKind,
  PlayerLimitMode,
} from "../../../constants/tournament";

interface renderStep3Props {
  setNumTeams: React.Dispatch<React.SetStateAction<number>>;
  setNumGroups: React.Dispatch<React.SetStateAction<number>>;
  effGroups: number;
  numTeams: number;
  format: TournamentFormat;
  phaseKind: TournamentPhaseKind;
  maxGroups: number;
  playerLimitMode: PlayerLimitMode;
  setPlayerLimitMode: React.Dispatch<React.SetStateAction<PlayerLimitMode>>;
  maxPlayersPerTeam: number;
  setMaxPlayersPerTeam: React.Dispatch<React.SetStateAction<number>>;
  extraPlayerCost: string;
  setExtraPlayerCost: React.Dispatch<React.SetStateAction<string>>;
}

const PLAYER_LIMIT_OPTIONS: {
  value: PlayerLimitMode;
  label: string;
  sub: string;
  icon: string;
}[] = [
  {
    value: PlayerLimitMode.MAX,
    label: "Numero massimo",
    sub: "Imposta il numero massimo di giocatori per squadra",
    icon: "people-outline",
  },
  {
    value: PlayerLimitMode.MAX_WITH_EXTRA,
    label: "Massimo + quota extra",
    sub: "Oltre il limite ogni giocatore in più paga una quota aggiuntiva",
    icon: "cash-outline",
  },
  {
    value: PlayerLimitMode.UNLIMITED,
    label: "Illimitato",
    sub: "Nessun limite al numero di giocatori per squadra",
    icon: "infinite-outline",
  },
];

export function renderStep3({
  setNumGroups,
  setNumTeams,
  effGroups,
  numTeams,
  format,
  phaseKind,
  maxGroups,
  playerLimitMode,
  setPlayerLimitMode,
  maxPlayersPerTeam,
  setMaxPlayersPerTeam,
  extraPlayerCost,
  setExtraPlayerCost,
}: renderStep3Props) {
  const teamsPerGroup = Math.ceil(numTeams / effGroups);
  const lastGroupSize = numTeams - (effGroups - 1) * teamsPerGroup;
  const unevenGroups = lastGroupSize !== teamsPerGroup && lastGroupSize > 0;
  const advancing = Math.min(effGroups * 2, numTeams);
  const matchInfo = estimateTotalMatches(
    numTeams,
    format,
    phaseKind,
    effGroups,
  );

  return (
    <>
      <Text style={s.sectionTitle}>Partecipanti</Text>
      <Text style={s.sectionSub}>
        {phaseKind === "single"
          ? "Definisci il numero di squadre. I partecipanti si iscriveranno al torneo."
          : "Definisci il numero di squadre e come distribuirle nei gironi."}
      </Text>

      <Text style={s.sectionLabel}>Numero di squadre</Text>
      <View style={s.fieldRow}>
        <View style={s.optionCardBody}>
          <Text style={s.fieldLabel}>Posti disponibili</Text>
          <Text style={s.fieldSub}>Le squadre si iscrivono autonomamente</Text>
        </View>
        <Stepper value={numTeams} min={2} max={64} onChange={setNumTeams} />
      </View>

      {/* Gironi picker — only for multi-phase */}
      {phaseKind === "multi" && (
        <>
          <Text style={s.sectionLabel}>Numero di gironi</Text>
          <View style={s.fieldRow}>
            <View style={s.optionCardBody}>
              <Text style={s.fieldLabel}>Gironi (gruppi)</Text>
              <Text style={s.fieldSub}>
                Le squadre vengono divise in gruppi
              </Text>
            </View>
            <Stepper
              value={effGroups}
              min={2}
              max={maxGroups}
              onChange={(v) => setNumGroups(v)}
            />
          </View>

          {/* Groups preview card */}
          <View
            style={[
              s.infoBox,
              { backgroundColor: colors.blueBg, borderColor: colors.lightBlue },
            ]}
          >
            <Ionicons name="grid-outline" size={20} color={colors.blue} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text
                style={[
                  s.infoBoxText,
                  { color: colors.dark, fontWeight: "700" },
                ]}
              >
                {effGroups} gironi da {teamsPerGroup} squadre
                {unevenGroups
                  ? ` (Girone ${String.fromCharCode(64 + effGroups)}: ${lastGroupSize} sq.)`
                  : ""}
              </Text>
              <Text style={[s.infoBoxText, { color: colors.placeholder }]}>
                Avanzano: top 2 per girone →{" "}
                <Text style={{ fontWeight: "700", color: colors.blue }}>
                  {advancing} squadre
                </Text>{" "}
                agli eliminatori
              </Text>
              <Text style={[s.infoBoxText, { color: colors.placeholder }]}>
                Nomi gironi:{" "}
                {Array.from(
                  { length: effGroups },
                  (_, i) => `Girone ${String.fromCharCode(65 + i)}`,
                ).join(", ")}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Player limit */}
      <Text style={s.sectionLabel}>Giocatori per squadra</Text>
      {PLAYER_LIMIT_OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            s.optionCard,
            { flexDirection: "row", alignItems: "center", marginBottom: 8, paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
            playerLimitMode === opt.value && s.optionCardSelected,
          ]}
          onPress={() => setPlayerLimitMode(opt.value)}
          activeOpacity={0.8}
        >
          <View style={[s.optionCardIcon, playerLimitMode === opt.value && s.optionCardIconSelected]}>
            <Ionicons
              name={opt.icon as any}
              size={18}
              color={playerLimitMode === opt.value ? colors.white : colors.placeholder}
            />
          </View>
          <View style={s.optionCardBody}>
            <Text style={s.optionCardTitle}>{opt.label}</Text>
            <Text style={s.optionCardSub}>{opt.sub}</Text>
          </View>
          <View style={[s.optionCardCheck, playerLimitMode === opt.value && s.optionCardCheckSelected]}>
            {playerLimitMode === opt.value && (
              <Ionicons name="checkmark" size={13} color={colors.white} />
            )}
          </View>
        </TouchableOpacity>
      ))}

      {playerLimitMode !== PlayerLimitMode.UNLIMITED && (
        <View style={s.fieldRow}>
          <View style={s.optionCardBody}>
            <Text style={s.fieldLabel}>Max giocatori per squadra</Text>
            <Text style={s.fieldSub}>Limite massimo di iscritti per team</Text>
          </View>
          <Stepper value={maxPlayersPerTeam} min={1} max={50} onChange={setMaxPlayersPerTeam} />
        </View>
      )}

      {playerLimitMode === PlayerLimitMode.MAX_WITH_EXTRA && (
        <View style={s.numberInputRow}>
          <Text style={s.fieldLabel}>Quota per giocatore extra (€)</Text>
          <View style={s.fieldMinInput}>
            <InputBox
              value={extraPlayerCost}
              onChangeText={setExtraPlayerCost}
              keyboardType="decimal-pad"
              placeholder="0"
              isDark={false}
              isBorderless
            />
            <Text style={s.numberInputSuffix}>€</Text>
          </View>
        </View>
      )}

      {/* Estimated matches (hidden for single-phase knockout) */}
      {!(phaseKind === "single" && format === "knockout") && (
        <View style={s.infoBox}>
          <Ionicons
            name="stats-chart-outline"
            size={18}
            color={colors.primary}
          />
          {phaseKind === "multi" ? (
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={[
                  s.infoBoxText,
                  { color: colors.dark, fontWeight: "700" },
                ]}
              >
                Partite stimate: {matchInfo.total}
              </Text>
              <Text style={s.infoBoxText}>
                {matchInfo.groups} nei gironi + {matchInfo.knockout} nella fase
                eliminatoria
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={[
                  s.infoBoxText,
                  { color: colors.dark, fontWeight: "700" },
                ]}
              >
                Partite stimate: {matchInfo.total}
              </Text>
              {numTeams % 2 !== 0 && format === "round-robin" && (
                <Text style={s.infoBoxText}>
                  Con N dispari: aggiunto un turno di Bye (vittoria d'ufficio).
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
}
