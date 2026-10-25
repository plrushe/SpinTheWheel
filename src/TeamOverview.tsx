import { useEffect, useRef, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import type { Formation } from './formations';
import { teamIds, type Player, type TeamId } from './logic';
import { displayTeamName, type TeamNames } from './teamNames';
import { FootballPitch } from './FootballPitch';
export const teamAccent = { A: '#b7dfae', B: '#b4d9eb' };
export function TeamOverview({ formations, players, teamNames, onClose }: { formations: Record<TeamId, Formation>; players: Player[]; teamNames: TeamNames; onClose: () => void }) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const dialog = ref.current!;
  const opener = document.activeElement as HTMLElement | null;
  dialog.showModal();
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { dialog.close(); document.body.style.overflow = overflow; opener?.focus(); };
 }, []);
 return <dialog ref={ref} className="team-overview" aria-labelledby="overview-title" onCancel={onClose} onClick={e => { if(e.target === e.currentTarget) { const r=e.currentTarget.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose(); } }}>
  <header><div><span className="eyebrow">THE MATCHUP</span><h2 id="overview-title">Two teams. One pitch to settle it.</h2></div><button aria-label="Close team overview" onClick={onClose}><X size={22}/></button></header>
  <div className="overview-pitches">{teamIds.map(team => {const squad=players.filter(p=>p.teamId===team&&p.slotId);return <section key={team} style={{'--team-accent':teamAccent[team]} as CSSProperties}><div className="overview-team-heading"><h3><span/>{displayTeamName(teamNames,team)}</h3><span>{formations[team].name} · {squad.length}/11 players</span></div><FootballPitch formation={formations[team]} players={squad} teamName={displayTeamName(teamNames,team)} accent={teamAccent[team]}/></section>;})}</div>
  <p className="overview-note">Players and positions are randomised across both teams. Locked players stay put.</p>
 </dialog>;
}
