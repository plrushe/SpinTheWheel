import type { Slot } from './formations';
export type Player = { id: string; name: string; slotId?: string; teamId?: TeamId; locked: boolean };
// Rejection sampling avoids modulo bias when reducing a cryptographic uint32.
export function randomIndex(length: number): number {
 if (!Number.isInteger(length) || length < 1) throw new Error('Random pool must not be empty');
 const ceiling = Math.floor(4294967296 / length) * length;
 const value = new Uint32Array(1);
 do { crypto.getRandomValues(value); } while (value[0] >= ceiling);
 return value[0] % length;
}
export function availableSlots(slots: Slot[], players: Player[], playerId: string, excludeGK: boolean) {
 const occupied = new Set(players.filter(p => p.id !== playerId).map(p => p.slotId));
 return slots.filter(s => !occupied.has(s.id) && !(excludeGK && s.id === 'GK'));
}
export function resetAssignments(players: Player[]): Player[] {
 return players.map(p => ({ ...p, slotId: undefined, teamId: undefined, locked: false }));
}
export function shuffleTeam(players: Player[], slots: Slot[], excludeGK: boolean): Player[] {
 const locked = new Set(players.filter(p => p.locked).map(p => p.slotId));
 const pool = slots.filter(s => !locked.has(s.id) && !(excludeGK && s.id === 'GK'));
 for (let i = pool.length - 1; i > 0; i--) { const j = randomIndex(i+1); [pool[i],pool[j]]=[pool[j],pool[i]]; }
 return players.map(p => p.locked ? p : {...p, slotId: pool.pop()?.id});
}

export const teamIds = ['A', 'B'] as const;
export type TeamId = typeof teamIds[number];
export type TeamSlots = Record<TeamId, Slot[]>;

export function availableTeamSlots(teams: TeamSlots, players: Player[], playerId: string, excludeGK: boolean, enabledTeams: readonly TeamId[] = teamIds) {
 return enabledTeams.map(team => ({ team, slots: availableSlots(teams[team], players.filter(p => p.teamId === team), playerId, excludeGK) }));
}

// Select the less populated eligible team; break ties fairly, then draw a uniform slot.
// Excluding the current player first releases both their old team and old position.
export function planAssignment(teams: TeamSlots, players: Player[], playerId: string, excludeGK: boolean, enabledTeams: readonly TeamId[] = teamIds) {
 const eligible = availableTeamSlots(teams, players, playerId, excludeGK, enabledTeams).filter(t => t.slots.length);
 if (!eligible.length) return undefined;
 const count = (team: TeamId) => players.filter(p => p.id !== playerId && p.teamId === team && p.slotId).length;
 const min = Math.min(...eligible.map(t => count(t.team)));
 const candidates = eligible.filter(t => count(t.team) === min);
 const chosen = candidates[randomIndex(candidates.length)];
 const index = randomIndex(chosen.slots.length);
 return { ...chosen, index, slot: chosen.slots[index] };
}

export function shuffled<T>(items: T[]): T[] {
 const result = [...items];
 for (let i = result.length - 1; i > 0; i--) { const j = randomIndex(i + 1); [result[i], result[j]] = [result[j], result[i]]; }
 return result;
}

export function resetTeamAssignments(players: Player[], team: TeamId): Player[] {
 return players.map(p => p.teamId === team ? { ...p, teamId: undefined, slotId: undefined, locked: false } : p);
}
