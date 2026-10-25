import type { Dispatch, SetStateAction } from 'react';
import { Flag, Shuffle } from 'lucide-react';
import type { Player, TeamId } from './logic';
import { drawSetPieces, setPieceRoles, type TeamSetPieceAssignments } from './setPieces';

type Props = { players: Player[]; team: TeamId; busy: boolean; results: TeamSetPieceAssignments; setResults: Dispatch<SetStateAction<TeamSetPieceAssignments>> };
const roles = setPieceRoles.filter(role => role.enabled);
export function SetPiecesPanel({ players, team, busy, results, setResults }: Props) {
 const eligible = players.filter(player => player.teamId === team && player.slotId);
 const summary = roles.map(role => {
  const player = eligible.find(player => player.id === results[team][role.id]);
  return player ? `${role.label}: ${player.name}` : '';
 }).filter(Boolean).join('. ');
 return <section className="set-pieces-panel" aria-labelledby="set-pieces-title">
  <div className="set-pieces-heading"><h2 id="set-pieces-title"><Flag size={16}/> Set-piece duties</h2><button className="secondary-button" disabled={busy || !eligible.length} onClick={() => setResults(previous => ({ ...previous, [team]: drawSetPieces(players, team, roles.map(role => role.id)) }))}><Shuffle size={14}/> Randomise takers</button></div>
  <span className="sr-only" aria-live="polite">{summary}</span>
 </section>;
}
