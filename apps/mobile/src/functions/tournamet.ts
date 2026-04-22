import { TournamentFormat, TournamentPhaseKind } from "../constants/tournament";
import { TournametNumberPartecipants } from "../types/tournament";

export function estimateTotalMatches(
  numTeams: number,
  format: TournamentFormat,
  phaseKind: TournamentPhaseKind,
  numGroups: number,
): TournametNumberPartecipants {
  if (phaseKind === "multi") {
    const effGroups = Math.max(1, numGroups);
    const tpg = Math.ceil(numTeams / effGroups);
    // Each group has tpg*(tpg-1)/2 matches; last group may have fewer teams
    let groupMatches = 0;
    for (let g = 0; g < effGroups; g++) {
      const start = g * tpg;
      const count = Math.min(tpg, numTeams - start);
      if (count >= 2) groupMatches += (count * (count - 1)) / 2;
    }
    const advancing = Math.min(effGroups * 2, numTeams);
    const koMatches = advancing - 1;
    return {
      total: groupMatches + koMatches,
      groups: groupMatches,
      knockout: koMatches,
    };
  }

  switch (format) {
    case "round-robin": {
      const eff = numTeams % 2 === 0 ? numTeams : numTeams + 1;
      const m =
        (eff * (eff - 1)) / 2 - (numTeams % 2 !== 0 ? (eff - 1) / 2 : 0);
      return { total: m, groups: m, knockout: 0 };
    }
    case "knockout":
      return { total: numTeams - 1, groups: 0, knockout: numTeams - 1 };
  }

  return { total: 0, groups: 0, knockout: 0 };
}
