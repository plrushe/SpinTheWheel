import type { Slot } from './formations';
export type Player = { id: string; name: string; slotId?: string; locked: boolean };
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
 return players.map(p => ({ ...p, slotId: undefined, locked: false }));
}
export function shuffleTeam(players: Player[], slots: Slot[], excludeGK: boolean): Player[] {
 const locked = new Set(players.filter(p => p.locked).map(p => p.slotId));
 const pool = slots.filter(s => !locked.has(s.id) && !(excludeGK && s.id === 'GK'));
 for (let i = pool.length - 1; i > 0; i--) { const j = randomIndex(i+1); [pool[i],pool[j]]=[pool[j],pool[i]]; }
 return players.map(p => p.locked ? p : {...p, slotId: pool.pop()?.id});
}
