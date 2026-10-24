import { randomIndex, type Player, type TeamId } from './logic';
export const setPieceRoles = [
 { id: 'free-kicks', label: 'Free kicks', enabled: true },
 { id: 'penalties', label: 'Penalties', enabled: true },
 { id: 'left-corners', label: 'Left corners', enabled: true },
 { id: 'right-corners', label: 'Right corners', enabled: true },
 { id: 'throw-ins', label: 'Throw-ins', enabled: false },
 { id: 'goal-kicks', label: 'Goal kicks', enabled: false },
] as const;
export type SetPieceRole = typeof setPieceRoles[number]['id'];
export type SetPieceAssignments = Partial<Record<SetPieceRole, string>>;
export function drawSetPieces(players: Player[], team: TeamId, roles: readonly SetPieceRole[]): SetPieceAssignments {
 const candidates = players.filter(p => p.teamId === team && p.slotId);
 if (!candidates.length) return {};
 return Object.fromEntries(roles.map(role => [role, candidates[randomIndex(candidates.length)].id]));
}
export function reconcileSetPieces(assignments: SetPieceAssignments, players: Player[], team: TeamId): SetPieceAssignments {
 const eligible = new Set(players.filter(p => p.teamId === team && p.slotId).map(p => p.id));
 return Object.fromEntries(Object.entries(assignments).filter(([,id]) => eligible.has(id)));
}
