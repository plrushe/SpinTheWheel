import { readPreference } from './privacyStorage';
import type { TeamId } from './logic';
export type TeamNames = Record<TeamId, string>;
export const TEAM_NAMES_STORAGE = 'fc-roulette-team-names-v1';
export const defaultTeamNames: TeamNames = { A: 'Team A', B: 'Team B' };
export function displayTeamName(names: TeamNames, team: TeamId) {
 return names[team].trim() || defaultTeamNames[team];
}
export function loadTeamNames(): TeamNames {
 try {
  const raw = JSON.parse(readPreference(TEAM_NAMES_STORAGE) || '{}');
  return { A: typeof raw?.A === 'string' ? raw.A.slice(0, 24) : defaultTeamNames.A, B: typeof raw?.B === 'string' ? raw.B.slice(0, 24) : defaultTeamNames.B };
 } catch { return { ...defaultTeamNames }; }
}
