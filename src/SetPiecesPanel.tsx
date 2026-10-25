import { useState, type Dispatch, type SetStateAction } from 'react';
import { Flag, Shuffle } from 'lucide-react';
import type { Player, TeamId } from './logic';
import { drawSetPieces, setPieceRoles, type TeamSetPieceAssignments, type SetPieceRole } from './setPieces';
export function SetPiecesPanel({ players, team, teamName, busy, results, setResults }: { players: Player[]; team: TeamId; teamName: string; busy: boolean; results: TeamSetPieceAssignments; setResults: Dispatch<SetStateAction<TeamSetPieceAssignments>> }) {
 const [enabled, setEnabled] = useState<SetPieceRole[]>(setPieceRoles.filter(r => r.enabled).map(r => r.id));
 const eligible = players.filter(p => p.teamId === team && p.slotId);
 const roles = setPieceRoles.filter(r => enabled.includes(r.id));
 return <section className="set-pieces-panel" aria-labelledby="set-pieces-title">
  <div className="set-pieces-heading"><div><h2 id="set-pieces-title"><Flag size={16}/> Set-piece duties</h2><p>{teamName}</p></div><button className="secondary-button" disabled={busy || !eligible.length || !roles.length} onClick={() => setResults(previous => ({ ...previous, [team]: drawSetPieces(players, team, enabled) }))}><Shuffle size={14}/> Randomise takers</button></div>
  <p className="set-pieces-description">Draws from this team’s assigned players. One player can take multiple roles.</p>
  <div className="set-piece-results" aria-live="polite">{roles.map(role => {
   const player = eligible.find(p => p.id === results[team][role.id]);
   return <div key={role.id}><span>{role.label}</span><strong>{player ? player.name : 'Not drawn'}{player && <small>{player.slotId}</small>}</strong></div>;
  })}</div>
  {!eligible.length && <p className="small-note">Spin players onto this team first to draw set-piece takers.</p>}
  {!roles.length && <p className="small-note">Enable at least one duty below.</p>}
  <details className="set-piece-options"><summary>Choose duties</summary><div>{setPieceRoles.map(role => <label key={role.id}><input type="checkbox" checked={enabled.includes(role.id)} disabled={busy} onChange={e => {
   setEnabled(e.target.checked ? [...enabled, role.id] : enabled.filter(id => id !== role.id));
   if (!e.target.checked) setResults(previous => {
    const next = { A: { ...previous.A }, B: { ...previous.B } };
    delete next.A[role.id]; delete next.B[role.id]; return next;
   });
  }}/>{role.label}</label>)}</div></details>
 </section>;
}
