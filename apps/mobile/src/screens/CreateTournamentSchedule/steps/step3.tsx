import { View, Text } from "react-native";
import { s } from "../CreateTournamentSchedule.styles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { Stepper } from "../../../components/Stepper/Stepper";
import { TournamentFormat, TournamentPhaseKind } from "../../../types";
import { estimateTotalMatches } from "../../../functions/tournamet";

interface renderStep3Props {
  setNumTeams: React.Dispatch<React.SetStateAction<number>>;
  setNumGroups: React.Dispatch<React.SetStateAction<number>>;
  effGroups: number;
  numTeams: number;
  format: TournamentFormat;
  phaseKind: TournamentPhaseKind;
  knockoutFormat: TournamentFormat;
  maxGroups: number;
}

export function renderStep3({
  setNumGroups,
  setNumTeams,
  effGroups,
  numTeams,
  format,
  phaseKind,
  knockoutFormat,
  maxGroups,
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
    phaseKind === "multi" ? knockoutFormat : undefined,
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
                style={[s.infoBoxText, { color: colors.dark, fontWeight: "700" }]}
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
                style={[s.infoBoxText, { color: colors.dark, fontWeight: "700" }]}
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
