import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, ScheduledMatch } from "../../types";
import {
  lastOutput,
  formatDisplayDate,
  formatDisplayTime,
  isoDateKey,
} from "../../utils/tournamentGenerator";
import { colors } from "../../theme/colors";
import { r } from "./TournamentScheduleResult.styles";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "TournamentScheduleResult"
>;

type TabKey = "calendar" | "teams" | "referee" | "standings" | "structure";

// ── Phase accent colors ────────────────────────────────────────────────────────
function phaseColor(phase: ScheduledMatch["phase"]): string {
  switch (phase) {
    case "final":
      return colors.primary;
    case "knockout":
      return colors.primaryGradientMid;
    case "groups":
      return colors.purpleBlue;
    case "losers":
      return colors.purple;
    default:
      return colors.grayDark;
  }
}

// ── Group matches by ISO date ─────────────────────────────────────────────────
function groupByDate(matches: ScheduledMatch[]): Map<string, ScheduledMatch[]> {
  const map = new Map<string, ScheduledMatch[]>();
  for (const m of matches) {
    if (m.isBye) continue;
    const key = isoDateKey(m.startTime);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
}

export default function TournamentScheduleResult({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("calendar");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [structureSubTab, setStructureSubTab] = useState<
    "gironi" | "eliminazione"
  >("gironi");

  const output = lastOutput;

  if (!output) {
    return (
      <SafeAreaView style={r.root} edges={["top"]}>
        <View style={r.header}>
          <TouchableOpacity
            style={r.headerSide}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.dark} />
          </TouchableOpacity>
          <Text style={r.headerTitle}>Risultato</Text>
          <View style={r.headerSide} />
        </View>
        <View style={r.emptyState}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.placeholder}
          />
          <Text style={r.emptyText}>
            Nessun calendario generato. Torna indietro e genera prima un torneo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { allMatches, teamSchedules, standings, config } = output;
  const realTeamNames = teamSchedules.map((ts) => ts.teamName);
  const currentTeamSchedule =
    teamSchedules.find((ts) => ts.teamName === selectedTeam) ??
    teamSchedules[0];

  // Dynamic tabs: Classifica only for single-phase round-robin, Struttura otherwise
  const showClassifica =
    config.phaseKind === "single" && config.format === "round-robin";
  const isMultiPhase = config.phaseKind === "multi";

  const tabs: { key: TabKey; label: string }[] = [
    { key: "calendar", label: "Calendario" },
    { key: "teams", label: "Schede" },
    { key: "referee", label: "Tabellino" },
    showClassifica
      ? { key: "standings", label: "Classifica" }
      : { key: "structure", label: "Struttura" },
  ];

  // ── Tab: Calendario ──────────────────────────────────────────────────────────
  function renderCalendar() {
    const byDate = groupByDate(allMatches);
    const sortedDates = Array.from(byDate.keys()).sort();

    if (sortedDates.length === 0) {
      return (
        <View style={r.emptyState}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={colors.placeholder}
          />
          <Text style={r.emptyText}>Nessuna partita in programma.</Text>
        </View>
      );
    }

    return (
      <>
        {sortedDates.map((dateKey) => {
          const dayMatches = byDate
            .get(dateKey)!
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime(),
            );
          return (
            <View key={dateKey}>
              <View style={r.dateHeader}>
                <Text style={r.dateHeaderText}>
                  {formatDisplayDate(dayMatches[0].startTime)}
                </Text>
              </View>
              {dayMatches.map((m) => (
                <View key={m.id} style={r.matchCard}>
                  <View style={{ flexDirection: "row", alignSelf: "stretch" }}>
                    <View
                      style={[
                        r.matchCardAccent,
                        { backgroundColor: phaseColor(m.phase) },
                      ]}
                    />
                    <View style={r.matchCardInner}>
                      <View>
                        <Text style={r.matchTime}>
                          {formatDisplayTime(m.startTime)}
                        </Text>
                        <Text style={r.matchField}>C. {m.field}</Text>
                      </View>
                      <View style={r.matchTeams}>
                        <Text style={r.matchTeamName} numberOfLines={1}>
                          {m.homeTeam}
                        </Text>
                        <Text style={r.matchVs}>vs</Text>
                        <Text style={r.matchTeamName} numberOfLines={1}>
                          {m.awayTeam}
                        </Text>
                      </View>
                      <View
                        style={[
                          r.matchLabel,
                          m.phase === "final" && r.matchLabelFinal,
                        ]}
                      >
                        <Text
                          style={[
                            r.matchLabelText,
                            m.phase === "final" && r.matchLabelFinalText,
                          ]}
                          numberOfLines={2}
                        >
                          {m.roundLabel}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {/* Bye matches summary */}
        {allMatches.some((m) => m.isBye) && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: colors.placeholder,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Turni di pausa (Bye)
            </Text>
            {allMatches
              .filter((m) => m.isBye)
              .map((m) => (
                <View key={m.id} style={[r.matchCard, { marginBottom: 6 }]}>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        r.matchCardAccent,
                        { backgroundColor: colors.disabled },
                      ]}
                    />
                    <View style={[r.matchCardInner]}>
                      <Ionicons
                        name="pause-circle-outline"
                        size={20}
                        color={colors.placeholder}
                      />
                      <View style={r.matchTeams}>
                        <Text
                          style={[
                            r.matchTeamName,
                            { color: colors.placeholder },
                          ]}
                        >
                          {m.homeTeam === "Bye (Pausa)"
                            ? m.awayTeam
                            : m.homeTeam}
                        </Text>
                        <Text style={[r.matchVs, { fontSize: 9 }]}>
                          pausa — vittoria d'ufficio
                        </Text>
                      </View>
                      <View style={r.matchByeBadge}>
                        <Text style={r.matchByeText}>{m.roundLabel}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}
      </>
    );
  }

  // ── Tab: Schede Squadra ──────────────────────────────────────────────────────
  function renderTeamSchedules() {
    const activeSchedule = currentTeamSchedule;

    return (
      <>
        {/* Team picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: colors.white,
            borderBottomWidth: 1,
            borderBottomColor: colors.gray,
          }}
          contentContainerStyle={r.teamPickerRow}
        >
          {realTeamNames.map((name) => (
            <TouchableOpacity
              key={name}
              style={[
                r.teamChip,
                (selectedTeam ?? realTeamNames[0]) === name &&
                  r.teamChipSelected,
              ]}
              onPress={() => setSelectedTeam(name)}
            >
              <Text
                style={[
                  r.teamChipText,
                  (selectedTeam ?? realTeamNames[0]) === name &&
                    r.teamChipTextSelected,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Matches for selected team */}
        {activeSchedule && activeSchedule.matches.length > 0 ? (
          activeSchedule.matches.map((m) => {
            const opponent =
              m.homeTeam === activeSchedule.teamName ? m.awayTeam : m.homeTeam;
            const isHome = m.homeTeam === activeSchedule.teamName;
            return (
              <View key={m.id} style={r.teamMatchRow}>
                <View style={r.teamMatchRoundBadge}>
                  <Text style={r.teamMatchRoundText}>
                    {m.roundLabel
                      .replace("Turno ", "T")
                      .replace("inali", "")
                      .replace("Quarti di finale", "QF")
                      .replace("Semifinali", "SF")
                      .replace("Finale", "F")}
                  </Text>
                </View>
                <View style={r.teamMatchInfo}>
                  <Text style={r.teamMatchOpponent} numberOfLines={1}>
                    {isHome ? "vs " : "@ "}
                    {opponent}
                  </Text>
                  <Text style={r.teamMatchMeta}>
                    {formatDisplayDate(m.startTime)} ·{" "}
                    {formatDisplayTime(m.startTime)} —{" "}
                    {formatDisplayTime(m.endTime)}
                  </Text>
                </View>
                <View style={r.teamMatchField}>
                  <Ionicons
                    name="flag-outline"
                    size={12}
                    color={colors.placeholder}
                  />
                  <Text style={r.teamMatchFieldText}>C.{m.field}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={r.emptyState}>
            <Ionicons
              name="person-outline"
              size={40}
              color={colors.placeholder}
            />
            <Text style={r.emptyText}>
              {activeSchedule
                ? `${activeSchedule.teamName} non ha partite pianificate (solo TBD o Bye).`
                : "Seleziona una squadra."}
            </Text>
          </View>
        )}
      </>
    );
  }

  // ── Tab: Tabellino Arbitro ───────────────────────────────────────────────────
  function renderRefereeSheets() {
    const concrete = allMatches.filter((m) => !m.isBye && m.homeTeam !== "TBD");

    if (concrete.length === 0) {
      return (
        <View style={[r.emptyState, { paddingTop: 40 }]}>
          <Ionicons
            name="document-text-outline"
            size={40}
            color={colors.placeholder}
          />
          <Text style={r.emptyText}>Nessuna partita concreta da mostrare.</Text>
        </View>
      );
    }

    // Group by round label
    const byRound = new Map<string, ScheduledMatch[]>();
    for (const m of concrete) {
      if (!byRound.has(m.roundLabel)) byRound.set(m.roundLabel, []);
      byRound.get(m.roundLabel)!.push(m);
    }

    return (
      <>
        {Array.from(byRound.entries()).map(([label, matches]) => (
          <View key={label}>
            <View style={r.dateHeader}>
              <Text style={r.dateHeaderText}>{label}</Text>
            </View>
            {matches.map((m) => (
              <View key={m.id} style={r.refCard}>
                <View style={r.refCardHeader}>
                  <Text style={r.refCardTitle}>Partita #{m.id}</Text>
                  <Text style={r.refCardMeta}>
                    {formatDisplayDate(m.startTime)} ·{" "}
                    {formatDisplayTime(m.startTime)}
                  </Text>
                </View>

                <View style={r.refTeamRow}>
                  <Text style={r.refTeamName}>{m.homeTeam}</Text>
                  <View style={r.refScoreBox}>
                    <Text style={r.refScoreText}>__</Text>
                  </View>
                </View>

                <View style={r.refDivider} />
                <Text style={r.refVs}>vs</Text>
                <View style={r.refDivider} />

                <View style={r.refTeamRow}>
                  <Text style={r.refTeamName}>{m.awayTeam}</Text>
                  <View style={r.refScoreBox}>
                    <Text style={r.refScoreText}>__</Text>
                  </View>
                </View>

                <View style={r.refFieldBadge}>
                  <Text style={r.refFieldText}>
                    Campo {m.field} · {formatDisplayTime(m.startTime)} →{" "}
                    {formatDisplayTime(m.endTime)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  }

  // ── Tab: Classifica (only for single-phase round-robin) ─────────────────────
  function renderStandings() {
    const sorted = [...standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

    const COL_WIDTHS = [24, undefined, 28, 20, 20, 20, 32];
    const COL_HEADERS = ["#", "Squadra", "G", "V", "P", "S", "Pt"];

    return (
      <View style={r.standingsCard}>
        <View style={r.standingsHeader}>
          {COL_HEADERS.map((h, i) => (
            <Text
              key={i}
              style={[
                r.standingsHeaderCell,
                { width: COL_WIDTHS[i], flex: i === 1 ? 1 : undefined },
              ]}
            >
              {h}
            </Text>
          ))}
        </View>
        {sorted.map((entry, idx) => (
          <View
            key={entry.teamName}
            style={[r.standingsRow, idx % 2 !== 0 && r.standingsRowEven]}
          >
            <Text style={r.standingsPos}>{idx + 1}</Text>
            <Text style={r.standingsName} numberOfLines={1}>
              {entry.teamName}
            </Text>
            <Text style={[r.standingsCell, { width: COL_WIDTHS[2] }]}>
              {entry.played}
            </Text>
            <Text style={[r.standingsCell, { width: COL_WIDTHS[3] }]}>
              {entry.won}
            </Text>
            <Text style={[r.standingsCell, { width: COL_WIDTHS[4] }]}>
              {entry.drawn}
            </Text>
            <Text style={[r.standingsCell, { width: COL_WIDTHS[5] }]}>
              {entry.lost}
            </Text>
            <Text style={[r.standingsPts, { width: COL_WIDTHS[6] }]}>
              {entry.points}
            </Text>
          </View>
        ))}
        <View style={{ padding: 12 }}>
          <Text
            style={{ fontSize: 10, color: colors.placeholder, lineHeight: 15 }}
          >
            Tie-break: 1. Scontro diretto · 2. Differenza goal · 3. Goal fatti
            {"\n"}
            Vittoria = 3 pt · Pareggio = 1 pt · Sconfitta = 0 pt
          </Text>
        </View>
      </View>
    );
  }

  // ── Tab: Struttura (knockout / double-elim, or multi-phase with gironi) ─────
  function renderGironi() {
    const groups = output!.groups ?? [];

    return (
      <>
        {groups.map((group) => (
          <View key={group.name} style={r.groupCard}>
            <View style={r.groupCardHeader}>
              <Ionicons name="shield-outline" size={18} color={colors.white} />
              <Text style={r.groupCardTitle}>{group.name}</Text>
              <Text style={r.groupCardCount}>{group.teams.length} squadre</Text>
            </View>

            {group.teams.map((team, i) => (
              <View
                key={team}
                style={[
                  r.groupTeamRow,
                  i === group.teams.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={r.groupTeamPos}>{i + 1}</Text>
                <Text style={r.groupTeamName}>{team}</Text>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  }

  function renderEliminazione() {
    const koMatches = allMatches.filter(
      (m) =>
        !m.isBye &&
        (m.phase === "knockout" || m.phase === "final" || m.phase === "losers"),
    );

    const byRound = new Map<string, ScheduledMatch[]>();
    for (const m of koMatches) {
      if (!byRound.has(m.roundLabel)) byRound.set(m.roundLabel, []);
      byRound.get(m.roundLabel)!.push(m);
    }

    if (byRound.size === 0) {
      return (
        <View style={r.emptyState}>
          <Ionicons
            name="trophy-outline"
            size={48}
            color={colors.placeholder}
          />
          <Text style={r.emptyText}>Nessuna partita ad eliminazione.</Text>
        </View>
      );
    }

    return (
      <>
        {Array.from(byRound.entries()).map(([label, matches]) => (
          <View key={label}>
            <View style={r.dateHeader}>
              <Text style={r.dateHeaderText}>{label}</Text>
            </View>
            {matches.map((m) => (
              <View key={m.id} style={r.matchCard}>
                <View style={{ flexDirection: "row", alignSelf: "stretch" }}>
                  <View
                    style={[
                      r.matchCardAccent,
                      { backgroundColor: phaseColor(m.phase) },
                    ]}
                  />
                  <View style={r.matchCardInner}>
                    <View style={r.matchTeams}>
                      <Text style={r.matchTeamName} numberOfLines={1}>
                        {m.homeTeam}
                      </Text>
                      <Text style={r.matchVs}>vs</Text>
                      <Text style={r.matchTeamName} numberOfLines={1}>
                        {m.awayTeam}
                      </Text>
                    </View>
                    {m.homeTeam !== "TBD" && (
                      <View>
                        <Text style={r.matchTime}>
                          {formatDisplayTime(m.startTime)}
                        </Text>
                        <Text style={r.matchField}>C.{m.field}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  }

  function renderStructure() {
    const effectiveSubTab = isMultiPhase ? structureSubTab : "eliminazione";

    return (
      <>
        {isMultiPhase && (
          <View style={r.subTabBar}>
            <TouchableOpacity
              style={[r.subTab, effectiveSubTab === "gironi" && r.subTabActive]}
              onPress={() => setStructureSubTab("gironi")}
            >
              <Text
                style={[
                  r.subTabText,
                  effectiveSubTab === "gironi" && r.subTabTextActive,
                ]}
              >
                Gironi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                r.subTab,
                effectiveSubTab === "eliminazione" && r.subTabActive,
              ]}
              onPress={() => setStructureSubTab("eliminazione")}
            >
              <Text
                style={[
                  r.subTabText,
                  effectiveSubTab === "eliminazione" && r.subTabTextActive,
                ]}
              >
                Eliminazione
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {effectiveSubTab === "gironi" && renderGironi()}
        {effectiveSubTab === "eliminazione" && renderEliminazione()}
      </>
    );
  }

  return (
    <SafeAreaView style={r.root} edges={["top"]}>
      {/* Header */}
      <View style={r.header}>
        <TouchableOpacity
          style={r.headerSide}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={r.headerTitle} numberOfLines={1}>
          {config.tournamentName || "Calendario Generato"}
        </Text>
        <View style={r.headerSide} />
      </View>

      {/* Tab bar */}
      <View style={r.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[r.tab, activeTab === tab.key && r.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[r.tabText, activeTab === tab.key && r.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={r.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "calendar" && renderCalendar()}
        {activeTab === "teams" && renderTeamSchedules()}
        {activeTab === "referee" && renderRefereeSheets()}
        {activeTab === "standings" && renderStandings()}
        {activeTab === "structure" && renderStructure()}
      </ScrollView>
    </SafeAreaView>
  );
}
