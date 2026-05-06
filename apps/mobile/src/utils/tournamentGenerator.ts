import {
  ScheduledMatch,
  GeneratorConfig,
  GeneratorOutput,
  GeneratorGroup,
  TeamSchedule,
  StandingsEntry,
  TournamentPhase,
} from "../types/tournament";

const BYE = "Bye (Pausa)";

// ── Internal match spec ───────────────────────────────────────────────────────

interface MatchSpec {
  home: string;
  away: string;
  phase: ScheduledMatch["phase"];
  roundLabel: string;
  isBye: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function advanceToNextPlayDay(
  from: Date,
  playDays: number[],
  startHour: number,
  startMinute = 0,
): Date {
  const d = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + 1,
    startHour,
    startMinute,
    0,
    0,
  );
  while (!playDays.includes(d.getDay())) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function knockoutRoundLabel(
  indexFromStart: number,
  totalRounds: number,
): string {
  const fromEnd = totalRounds - 1 - indexFromStart;
  if (fromEnd === 0) return "Finale";
  if (fromEnd === 1) return "Semifinali";
  if (fromEnd === 2) return "Quarti di finale";
  if (fromEnd === 3) return "Ottavi di finale";
  return `Turno ${indexFromStart + 1}`;
}

// ── Round-Robin (Berger rotation) ─────────────────────────────────────────────

function roundRobinPairs(teams: string[], phaseLabel: string): MatchSpec[][] {
  // teams.length must be even; caller adds BYE if odd
  const n = teams.length;
  const arr = [...teams];
  const rounds: MatchSpec[][] = [];

  for (let r = 0; r < n - 1; r++) {
    const round: MatchSpec[] = [];
    for (let i = 0; i < n / 2; i++) {
      const home = arr[i];
      const away = arr[n - 1 - i];
      const isBye = home === BYE || away === BYE;
      round.push({
        home: isBye && away === BYE ? home : home,
        away: isBye && home === BYE ? away : away,
        phase: TournamentPhase.MAIN,
        roundLabel: `${phaseLabel}Turno ${r + 1}`,
        isBye,
      });
    }
    rounds.push(round);
    // Berger rotation: move last element to position 1, keep position 0 fixed
    const last = arr.splice(n - 1, 1)[0];
    arr.splice(1, 0, last);
  }

  return rounds;
}

// ── Knockout bracket ──────────────────────────────────────────────────────────

function knockoutPairs(teams: string[], phaseLabel: string): MatchSpec[][] {
  const N = teams.length;
  const nextPow2 = nextPowerOf2(N);
  const numByes = nextPow2 - N;

  // First teams get byes when N is not a power of 2
  const playingInR1 = teams.slice(numByes);
  const rounds: MatchSpec[][] = [];

  // Round 1 (may be empty if all teams get byes, i.e. N is power of 2 and numByes=0)
  if (playingInR1.length >= 2) {
    const r1: MatchSpec[] = [];
    for (let i = 0; i < playingInR1.length / 2; i++) {
      r1.push({
        home: playingInR1[i],
        away: playingInR1[playingInR1.length - 1 - i],
        phase: TournamentPhase.KNOCKOUT,
        roundLabel: "", // assigned after
        isBye: false,
      });
    }
    rounds.push(r1);
  }

  // Subsequent rounds (TBD teams)
  let teamsInNextRound = nextPow2 / 2; // after R1 + byes combine
  while (teamsInNextRound > 1) {
    const matchCount = teamsInNextRound / 2;
    const rN: MatchSpec[] = [];
    for (let i = 0; i < matchCount; i++) {
      rN.push({
        home: "TBD",
        away: "TBD",
        phase:
          matchCount === 1 ? TournamentPhase.FINAL : TournamentPhase.KNOCKOUT,
        roundLabel: "", // assigned after
        isBye: false,
      });
    }
    rounds.push(rN);
    teamsInNextRound = matchCount;
  }

  // Assign labels
  const totalRounds = rounds.length;
  for (let i = 0; i < totalRounds; i++) {
    const label = phaseLabel + knockoutRoundLabel(i, totalRounds);
    rounds[i] = rounds[i].map((m) => ({ ...m, roundLabel: label }));
  }

  return rounds;
}

// ── Scheduling ────────────────────────────────────────────────────────────────

function scheduleRounds(
  rounds: MatchSpec[][],
  config: GeneratorConfig,
): ScheduledMatch[] {
  const allMatches: ScheduledMatch[] = [];
  let matchId = 1;

  const [yr, mo, da] = config.startDate.split("-").map(Number);
  const sm = config.startMinute ?? 0;
  let currentDate = new Date(yr, mo - 1, da, config.startHour, sm, 0, 0);

  // Advance to first valid play day
  while (!config.playDays.includes(currentDate.getDay())) {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      config.startHour,
      sm,
      0,
      0,
    );
  }

  // Track team match counts per day: "teamName::YYYY-MM-DD" → count
  const teamDayCount = new Map<string, number>();
  // Track total matches per day: "YYYY-MM-DD" → count
  const dayTotalCount = new Map<string, number>();

  function dayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
  function countKey(team: string, date: Date): string {
    return `${team}::${dayKey(date)}`;
  }
  function getCount(team: string, date: Date): number {
    return teamDayCount.get(countKey(team, date)) ?? 0;
  }
  function getDayTotal(date: Date): number {
    return dayTotalCount.get(dayKey(date)) ?? 0;
  }
  function increment(team: string, date: Date) {
    const k = countKey(team, date);
    teamDayCount.set(k, (teamDayCount.get(k) ?? 0) + 1);
  }
  function incrementDayTotal(date: Date, count: number) {
    const k = dayKey(date);
    dayTotalCount.set(k, (dayTotalCount.get(k) ?? 0) + count);
  }

  const dailyLimit = config.maxMatchesPerDay ?? Infinity;

  function canFitBatch(batch: MatchSpec[], date: Date): boolean {
    if (!config.playDays.includes(date.getDay())) return false;
    // Check total daily match limit
    const realCount = batch.filter(
      (m) => !m.isBye && m.home !== "TBD" && m.away !== "TBD",
    ).length;
    if (getDayTotal(date) + realCount > dailyLimit) return false;
    // Check per-team daily limit
    for (const m of batch) {
      if (m.isBye || m.home === "TBD" || m.away === "TBD") continue;
      if (getCount(m.home, date) >= config.maxMatchesPerDayPerTeam)
        return false;
      if (getCount(m.away, date) >= config.maxMatchesPerDayPerTeam)
        return false;
    }
    return true;
  }

  let prevPhase: string | null = null;

  for (let roundIdx = 0; roundIdx < rounds.length; roundIdx++) {
    const roundMatches = rounds[roundIdx];
    if (roundMatches.length === 0) continue;

    const currPhase = roundMatches[0]?.phase ?? null;

    // Phase change (groups → knockout) or final day: advance to next day (skip in single-day mode)
    if (
      !config.singleDay &&
      ((prevPhase &&
        currPhase &&
        prevPhase !== currPhase &&
        prevPhase === "groups") ||
        (config.hasFinalDay && roundIdx === rounds.length - 1))
    ) {
      if (
        config.hasFinalDay &&
        config.finalDayDate &&
        roundIdx === rounds.length - 1
      ) {
        // Jump to the exact final day date chosen by the user
        const [fy, fm, fd] = config.finalDayDate.split("-").map(Number);
        const fdh = config.finalDayHour ?? config.startHour;
        const fdm = config.finalDayMinute ?? sm;
        currentDate = new Date(fy, fm - 1, fd, fdh, fdm, 0, 0);
      } else {
        currentDate = advanceToNextPlayDay(
          currentDate,
          config.playDays,
          config.startHour,
          sm,
        );
      }
    }
    prevPhase = currPhase;

    // Process round in batches of numFields (concurrent matches)
    for (let i = 0; i < roundMatches.length; i += config.numFields) {
      const batch = roundMatches.slice(i, i + config.numFields);

      // Ensure we're on a valid play day and within daily limits
      if (!canFitBatch(batch, currentDate)) {
        currentDate = advanceToNextPlayDay(
          currentDate,
          config.playDays,
          config.startHour,
          sm,
        );
      }

      // Schedule each match in the batch on a different field simultaneously
      let realScheduled = 0;
      batch.forEach((m, fieldIdx) => {
        const startTime = new Date(currentDate);
        const endTime = new Date(
          currentDate.getTime() + config.matchDurationMinutes * 60_000,
        );

        allMatches.push({
          id: String(matchId++),
          homeTeam: m.home,
          awayTeam: m.away,
          field: m.isBye ? 0 : fieldIdx + 1,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          round: roundIdx + 1,
          phase: m.phase,
          isBye: m.isBye,
          roundLabel: m.roundLabel,
        });

        if (!m.isBye && m.home !== "TBD" && m.away !== "TBD") {
          increment(m.home, startTime);
          increment(m.away, startTime);
          realScheduled++;
        }
      });
      incrementDayTotal(currentDate, realScheduled);

      // Advance time for next sub-batch
      currentDate = new Date(
        currentDate.getTime() +
          (config.matchDurationMinutes +
            config.restMinutes +
            config.travelMinutes) *
            60_000,
      );

      // For multi-day mode: if it's gotten late (past 22:00) roll to next play day
      if (!config.singleDay && currentDate.getHours() >= 22) {
        currentDate = advanceToNextPlayDay(
          currentDate,
          config.playDays,
          config.startHour,
          sm,
        );
      }
    }
  }

  return allMatches;
}

// ── Last generated output (module-level cache, follows project pattern) ───────

export let lastOutput: GeneratorOutput | null = null;

// ── Main export ───────────────────────────────────────────────────────────────

export function generateTournament(config: GeneratorConfig): GeneratorOutput {
  if (config.participants.length < 2) {
    throw new Error("Servono almeno 2 partecipanti.");
  }
  if (config.playDays.length === 0) {
    throw new Error("Seleziona almeno un giorno di gioco.");
  }
  if (config.numFields < 1) {
    throw new Error("Serve almeno 1 campo.");
  }

  const teamNames = config.participants.map(
    (p, i) => p.name.trim() || `Squadra ${i + 1}`,
  );
  const realTeams = teamNames.filter((n) => n !== BYE);

  // Build round specs
  let rounds: MatchSpec[][];
  let groupsInfo: GeneratorGroup[] | undefined;

  if (config.phaseKind === "multi") {
    const numGroups = Math.max(1, config.numGroups ?? 2);
    const teamsPerGroup = Math.ceil(realTeams.length / numGroups);

    // Build group metadata
    groupsInfo = [];
    const groupRoundsData: MatchSpec[][][] = [];
    for (let g = 0; g < numGroups; g++) {
      const groupTeams = realTeams.slice(
        g * teamsPerGroup,
        (g + 1) * teamsPerGroup,
      );
      if (groupTeams.length < 2) continue;
      const letter = String.fromCharCode(65 + g);
      const groupName = numGroups === 1 ? "Girone" : `Girone ${letter}`;
      groupsInfo.push({ name: groupName, teams: groupTeams });

      const withBye =
        groupTeams.length % 2 !== 0 ? [...groupTeams, BYE] : groupTeams;
      const label = numGroups === 1 ? "Girone - " : `Girone ${letter} - `;
      groupRoundsData.push(
        roundRobinPairs(withBye, label).map((r) =>
          r.map((m) => ({ ...m, phase: TournamentPhase.GROUPS })),
        ),
      );
    }

    // Interleave: global round R = all groups' round R played simultaneously
    const maxRounds = Math.max(...groupRoundsData.map((g) => g.length));
    const groupsRounds: MatchSpec[][] = [];
    for (let r = 0; r < maxRounds; r++) {
      const combined: MatchSpec[] = [];
      for (const gd of groupRoundsData) {
        if (gd[r]) combined.push(...gd[r]);
      }
      if (combined.length > 0) groupsRounds.push(combined);
    }

    // Knockout: top 2 per group advance, cross-group ordering
    const advancingCount = Math.min(numGroups * 2, realTeams.length);
    const groupLetters = Array.from({ length: numGroups }, (_, i) =>
      String.fromCharCode(65 + i),
    );
    const winners = groupLetters.map((l) => `1° Gir. ${l}`);
    const runnersUpTail = groupLetters
      .slice(1)
      .reverse()
      .map((l) => `2° Gir. ${l}`);
    const allKoLabels = [
      ...winners,
      `2° Gir. ${groupLetters[0]}`,
      ...runnersUpTail,
    ];
    const koTeams = allKoLabels.slice(0, advancingCount);

    const koRounds = knockoutPairs(koTeams, "");
    rounds = [...groupsRounds, ...koRounds];
  } else {
    switch (config.format) {
      case "round-robin": {
        const withBye =
          realTeams.length % 2 !== 0 ? [...realTeams, BYE] : realTeams;
        rounds = roundRobinPairs(withBye, "");
        break;
      }
      case "knockout":
        rounds = knockoutPairs(realTeams, "");
        break;
      default:
        rounds = [];
    }
  }

  const allMatches = scheduleRounds(rounds, config);

  // Team schedules (concrete matches only)
  const teamSchedules: TeamSchedule[] = realTeams.map((name) => ({
    teamName: name,
    matches: allMatches.filter(
      (m) => (m.homeTeam === name || m.awayTeam === name) && !m.isBye,
    ),
  }));

  // Initial standings (all zeroes — filled in as results come in)
  const standings: StandingsEntry[] = realTeams.map((name) => {
    const byeWins = allMatches.filter(
      (m) => m.isBye && (m.homeTeam === name || m.awayTeam === name),
    ).length;
    return {
      teamName: name,
      played: byeWins,
      won: byeWins,
      drawn: 0,
      lost: 0,
      points: byeWins * 3,
      goalsFor: 0,
      goalsAgainst: 0,
    };
  });

  const output: GeneratorOutput = {
    config,
    allMatches,
    teamSchedules,
    standings,
    groups: groupsInfo,
  };
  lastOutput = output;
  return output;
}

// ── Display helpers (used by result screen) ───────────────────────────────────

const IT_DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const IT_MONTHS = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return `${IT_DAYS[d.getDay()]} ${d.getDate()} ${IT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDisplayTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function isoDateKey(iso: string): string {
  return iso.slice(0, 10);
}
