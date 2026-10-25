import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pencil } from 'lucide-react';
import type { Player, TeamId } from './logic';
import { displayTeamName, defaultTeamNames, type TeamNames } from './teamNames';
import { teamAccent } from './TeamOverview';

type Props = {
 teams: readonly TeamId[];
 activeTeam: TeamId;
 names: TeamNames;
 players: Player[];
 busy: boolean;
 onSelect: (team: TeamId) => void;
 onRename: (team: TeamId, name: string) => void;
};
export function TeamTabs({ teams, activeTeam, names, players, busy, onSelect, onRename }: Props) {
 const [editing, setEditing] = useState<TeamId | null>(null);
 const [draft, setDraft] = useState('');
 const inputRef = useRef<HTMLInputElement>(null);
 const finished = useRef(false);
 useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select(); } }, [editing]);
 function startEditing(team: TeamId) {
  if (busy) return;
  finished.current = false;
  onSelect(team);
  setDraft(names[team]);
  setEditing(team);
 }
 function finishEditing(save: boolean, restoreFocus: boolean) {
  if (!editing || finished.current) return;
  finished.current = true;
  const team = editing;
  if (save) onRename(team, draft.trim() || defaultTeamNames[team]);
  setEditing(null);
  if (restoreFocus) queueMicrotask(() => document.getElementById(`team-tab-${team}`)?.focus());
 }
 return <div className="team-tabs" role="tablist" aria-label="Team boards">{teams.map(team => <div key={team} className="team-tab-item" data-selected={activeTeam === team} style={{ '--team-accent': teamAccent[team] } as CSSProperties}>
  <button id={`team-tab-${team}`} role="tab" aria-selected={activeTeam === team} aria-controls="team-board" tabIndex={activeTeam === team ? 0 : -1} disabled={busy} title="Double-click or press F2 to rename" onClick={() => onSelect(team)} onDoubleClick={() => startEditing(team)} onKeyDown={e => {
   if (e.key === 'F2') { e.preventDefault(); startEditing(team); }
   if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
    const next = e.key === 'Home' ? teams[0] : e.key === 'End' ? teams[teams.length - 1] : teams[(teams.indexOf(team) + (e.key === 'ArrowRight' ? 1 : -1) + teams.length) % teams.length];
    onSelect(next); document.getElementById(`team-tab-${next}`)?.focus();
   }
  }}><span/><span className="team-tab-name">{displayTeamName(names, team)}</span><b>{players.filter(p => p.teamId === team && p.slotId).length}/11</b></button>
  <button className="team-tab-rename" aria-label={`Rename Team ${team}`} title={`Rename ${displayTeamName(names, team)}`} disabled={busy} onClick={() => startEditing(team)}><Pencil size={11}/></button>
  {editing === team && <input ref={inputRef} className="team-tab-input" aria-label={`Team ${team} name`} maxLength={24} value={draft} disabled={busy} onChange={e => setDraft(e.target.value)} onBlur={() => finishEditing(true, false)} onKeyDown={e => {
   if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finishEditing(e.key === 'Enter', true); }
  }}/>}
 </div>)}</div>;
}
