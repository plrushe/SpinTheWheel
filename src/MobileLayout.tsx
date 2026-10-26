import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Check, ChevronDown, Crosshair, Download, Home, LockKeyhole, Menu, MoreHorizontal, Pencil, Plus, RotateCcw, Settings, Settings2, Shuffle, UnlockKeyhole, Users, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { formations, type Formation, type Slot } from './formations';
import type { Player, TeamId } from './logic';
import { FootballPitch } from './FootballPitch';
import { PositionWheel } from './PositionWheel';
import { TeamTabs } from './TeamTabs';
import { FormationLockButton } from './FormationLockButton';
import { teamAccent } from './TeamOverview';
import type { TeamNames } from './teamNames';
import { drawSetPieces, setPieceRoles, type TeamSetPieceAssignments } from './setPieces';
import './mobile.css';

type Props = {
 players: Player[]; active?: Player; capacity: number; assigned: number; busy: boolean; disabled: boolean;
 names: TeamNames; teamName: (team: TeamId) => string; teams: readonly TeamId[]; team: TeamId;
 formation: Formation; formationDisplay: string; formationLocked: boolean;
 secondTeamEnabled: boolean; instant: boolean; sound: boolean; excludeGK: boolean;
 group: string; enabled: string[]; wheelSlots: Slot[]; rotation: number;
 result: {name: string; position: string; team: TeamId} | null;
 setPieces: TeamSetPieceAssignments; pitchRef: RefObject<SVGSVGElement | null>;
 saved: boolean; remember: boolean; notice: string; privacyControls: ReactNode;
 onPlayers: (players: Player[]) => void; onSelectPlayer: (id: string) => void;
 onTeam: (team: TeamId) => void; onRename: (team: TeamId, name: string) => void;
 onFormation: (id: string) => void; onRandomFormation: () => Promise<void>; onFormationLock: () => void;
 onGroup: (group: string) => void; onEnabled: (ids: string[]) => void;
 onTeamMode: (enabled: boolean) => void; onSound: () => void; onInstant: () => void; onExcludeGK: (enabled: boolean) => void;
 onSpin: (all?: boolean, playerId?: string) => Promise<void>; onSave: () => void;
 onExport: () => Promise<void>; onOverview: () => void; onReset: () => void;
 onSetPieces: (results: TeamSetPieceAssignments) => void; onDismiss: () => void;
};
const roles = setPieceRoles.filter(role => role.enabled);
type Tab = 'game' | 'squad' | 'settings';

function RouletteOverlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const dialog = ref.current!, opener = document.activeElement as HTMLElement | null;
  const overflow = document.body.style.overflow;
  dialog.showModal(); document.body.style.overflow = 'hidden';
  return () => { dialog.close(); document.body.style.overflow = overflow; opener?.focus(); };
 }, []);
 return <dialog ref={ref} className="mobile-roulette" aria-labelledby="mobile-wheel-title" onCancel={onClose}>
  <header><h2 id="mobile-wheel-title">Leave it to luck</h2><button aria-label="Close roulette" onClick={onClose}><X size={23}/></button></header>
  {children}
 </dialog>;
}

export function MobileLayout(p: Props) {
 const [tab, setTab] = useState<Tab>('game');
 const [name, setName] = useState(''), [editing, setEditing] = useState(''), [draft, setDraft] = useState('');
 const [wheelOpen, setWheelOpen] = useState(false);
 const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => setReducedMotion(media.matches); media.addEventListener('change',change); return () => media.removeEventListener('change',change); }, []);
 // Browser keyboards shrink the visual viewport; keep the input visible and move navigation out of its way.
 const root = useRef<HTMLDivElement>(null);
 useEffect(() => {
  const viewport = window.visualViewport;
  const update = () => { if(root.current)root.current.dataset.keyboard = String(!!viewport && window.innerHeight - viewport.height > 140); };
  viewport?.addEventListener('resize', update); update();
  return () => viewport?.removeEventListener('resize',update);
 }, []);
 const teamPlayers = p.players.filter(player => player.teamId === p.team);
 const teamAssigned = teamPlayers.filter(player => player.slotId).length;
 const eligible = teamPlayers.filter(player => player.slotId);
 const spinPending = useRef(false);
 async function startSpin(all = false, playerId?: string) {
  if(spinPending.current || p.busy)return;
  spinPending.current = true; setWheelOpen(true);
  // Paint the wheel at its starting angle before the shared handler changes rotation.
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  try { await p.onSpin(all,playerId); } finally { spinPending.current = false; }
 }
 function editPlayer(player: Player) { setEditing(player.id); setDraft(player.name); }
 function saveName() { if(draft.trim())p.onPlayers(p.players.map(player => player.id === editing ? {...player,name:draft.trim()} : player)); setEditing(''); }
 return <div ref={root} className={`mobile-app mobile-tab-${tab}`}>
  <header className="mobile-header"><a className="mobile-brand" href="#" onClick={e => {e.preventDefault();setTab('game');}}><span><img src="/favicon.svg" width="43" height="43" alt=""/></span><div>FC ROULETTE<small>FOOTBALL POSITION RANDOMISER</small></div></a><button aria-label="Open settings" onClick={() => setTab('settings')}><Menu size={25}/></button></header>
  <main className="mobile-main">
   <section hidden={tab !== 'game'} aria-label="Game" className="mobile-game">
    <div className="mobile-formation"><label><span>FORMATION</span><span className="mobile-formation-select"><select aria-label="Select formation" value={p.formation.id} disabled={p.busy || p.formationLocked} onChange={e => p.onFormation(e.target.value)}>{formations.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select><ChevronDown size={15}/></span></label><button className="mobile-random" disabled={p.busy || p.formationLocked} onClick={() => void p.onRandomFormation()}><Shuffle size={21}/><span>Random</span></button></div>
    {p.formationDisplay && <p className="mobile-formation-draw" role="status">{p.formationDisplay}</p>}
    <div className="mobile-team-selector"><TeamTabs teams={p.teams} activeTeam={p.team} names={p.names} players={p.players} busy={p.busy} onSelect={p.onTeam} onRename={p.onRename}/>{p.secondTeamEnabled && <button className="mobile-both" aria-label="View both teams" onClick={p.onOverview}><Users size={22}/></button>}</div>
    <div id="team-board" role="tabpanel" aria-labelledby={`team-tab-${p.team}`}><FootballPitch ref={p.pitchRef} mobile formation={p.formation} players={teamPlayers} latest={p.result?.team === p.team ? p.result.position : undefined} teamName={p.teamName(p.team)} accent={teamAccent[p.team]} setPieces={p.setPieces[p.team]}/></div>
    <div className="mobile-status"><span><i/>{p.busy ? 'Drawing your lineup…' : p.active ? `Next up: ${p.active.name}` : 'Add players in Squad'}</span><span>{teamAssigned}/11 assigned</span></div>
    <details className="mobile-details"><summary><span>Set-piece duties</span><ChevronDown size={18}/></summary><div className="mobile-duties"><div className="mobile-duty-grid">{roles.map(role => <label key={role.id}>{role.label}<select aria-label={role.label} disabled={p.busy || !eligible.length} value={p.setPieces[p.team][role.id] || ''} onChange={e => p.onSetPieces({...p.setPieces,[p.team]:{...p.setPieces[p.team],[role.id]:e.target.value}})}><option value="">Not assigned</option>{eligible.map(player => <option key={player.id} value={player.id}>{player.name}</option>)}</select></label>)}</div><button className="secondary-button" disabled={p.busy || !eligible.length} onClick={() => p.onSetPieces({...p.setPieces,[p.team]:drawSetPieces(p.players,p.team,roles.map(role => role.id))})}><Shuffle size={16}/> Randomise takers</button></div></details>
    <details className="mobile-details"><summary><span>Formation options</span><Settings2 size={18}/></summary><div className="mobile-formation-options"><div className="mobile-lock-row"><span>Lock team formation</span><FormationLockButton locked={p.formationLocked} disabled={p.busy} onToggle={p.onFormationLock}/></div><label>Formation group<select aria-label="Formation group" value={p.group} disabled={p.busy} onChange={e => p.onGroup(e.target.value)}><option value="all">All formations</option><option value="3">3 at the back</option><option value="4">4 at the back</option><option value="5">5 at the back</option></select></label><details className="mobile-pool"><summary>Random selection pool · {p.enabled.length} enabled</summary><button disabled={p.busy} onClick={() => p.onEnabled(p.enabled.length ? [] : formations.map(f => f.id))}>{p.enabled.length ? 'Clear all' : 'Select all'}</button><div>{formations.map(f => <label key={f.id}><input type="checkbox" disabled={p.busy} checked={p.enabled.includes(f.id)} onChange={e => p.onEnabled(e.target.checked ? [...p.enabled,f.id] : p.enabled.filter(id => id !== f.id))}/>{f.name}</label>)}</div></details></div></details>
    <button className="mobile-export" disabled={p.busy} onClick={() => void p.onExport()}><Download size={18}/> Export {p.teamName(p.team)}</button>
   </section>
   <section hidden={tab !== 'squad'} className="mobile-squad" aria-label="Squad">
    <div className="mobile-screen-title"><h1>Your squad</h1><span>{p.players.length} / {p.capacity}</span></div>
    <form className="mobile-add" onSubmit={e => {e.preventDefault();if(!name.trim() || p.busy || p.players.length >= p.capacity)return;const player = {id:crypto.randomUUID(),name:name.trim(),locked:false};p.onPlayers([...p.players,player]);p.onSelectPlayer(player.id);setName('');}}><input aria-label="Player name" placeholder="Enter player name…" value={name} maxLength={24} disabled={p.busy || p.players.length >= p.capacity} onChange={e => setName(e.target.value)}/><button aria-label="Add player" disabled={p.busy || !name.trim() || p.players.length >= p.capacity}><Plus size={20}/> Add</button></form>
    <p className="mobile-squad-progress">{p.assigned} of {p.players.length} assigned · {p.capacity} positions available</p>
    {!p.players.length && <div className="mobile-empty"><Users size={36}/><h2>The squad’s waiting.</h2><p>Add yourself and your friends to start the draw.</p></div>}
    <div className="mobile-roster">{p.players.map((player,index) => <div className="mobile-player" key={player.id}>
     <button className="mobile-player-number" aria-label={`Select ${player.name}`} disabled={p.busy || player.locked} onClick={() => p.onSelectPlayer(player.id)}>{String(index+1).padStart(2,'0')}</button>
     <div className="mobile-player-info">{editing === player.id ? <form onSubmit={e => {e.preventDefault();saveName();}}><input aria-label="Edit player name" value={draft} maxLength={24} autoFocus onChange={e => setDraft(e.target.value)} onKeyDown={e => {if(e.key === 'Escape')setEditing('');}}/><button aria-label="Save name"><Check size={20}/></button></form> : <><strong>{player.name}{player.locked && <LockKeyhole size={13}/>}</strong><span>{player.teamId && player.slotId ? `${p.teamName(player.teamId)} · ${player.slotId}` : 'Waiting for a spin'}</span></>}</div>
     <button className="mobile-player-spin" aria-label={`Spin ${player.name}`} disabled={p.busy || player.locked} onClick={() => startSpin(false,player.id)}>Spin</button>
     <details className="mobile-player-menu"><summary aria-label={`Actions for ${player.name}`}><MoreHorizontal size={23}/></summary><div><button disabled={p.busy} onClick={e => {editPlayer(player);e.currentTarget.closest('details')?.removeAttribute('open');}}><Pencil size={16}/> Edit name</button><button disabled={p.busy || !player.slotId} onClick={e => {p.onPlayers(p.players.map(q => q.id === player.id ? {...q,locked:!q.locked} : q));e.currentTarget.closest('details')?.removeAttribute('open');}}>{player.locked ? <UnlockKeyhole size={16}/> : <LockKeyhole size={16}/>} {player.locked ? 'Unlock player' : 'Lock player'}</button><button disabled={p.busy} onClick={() => p.onPlayers(p.players.filter(q => q.id !== player.id))}><X size={16}/> Remove player</button></div></details>
    </div>)}</div>
    <button className="secondary-button mobile-save" disabled={p.busy || !p.players.length} onClick={p.onSave}>{p.saved ? <Check size={18}/> : <Users size={18}/>} {p.saved ? 'Roster saved' : 'Save roster'}</button><p className="mobile-storage-note">{p.remember ? 'Saved only in this browser.' : 'Enable optional storage to save for next time.'}</p>
   </section>
   <section hidden={tab !== 'settings'} className="mobile-settings" aria-label="Settings"><div className="mobile-screen-title"><h1>Settings</h1><Settings size={23}/></div>
    <label className="mobile-setting"><span><strong>Two-team draw</strong><small>Random teams and positions</small></span><input type="checkbox" role="switch" checked={p.secondTeamEnabled} disabled={p.busy} onChange={e => p.onTeamMode(e.target.checked)}/></label>
    <button className="mobile-setting" aria-pressed={p.sound} onClick={p.onSound}><span><strong>{p.sound ? <Volume2 size={20}/> : <VolumeX size={20}/>} Sound</strong><small>Play sounds during spins</small></span><span className={`mobile-switch ${p.sound ? 'on' : ''}`}/></button>
    <button className="mobile-setting" disabled={p.busy} aria-pressed={p.instant} onClick={p.onInstant}><span><strong><Zap size={20}/> Instant mode</strong><small>Skip the roulette animation</small></span><span className={`mobile-switch ${p.instant ? 'on' : ''}`}/></button>
    <label className="mobile-setting"><span><strong>Exclude goalkeeper</strong><small>Keep goalkeepers out of future spins</small></span><input type="checkbox" checked={p.excludeGK} disabled={p.busy} onChange={e => p.onExcludeGK(e.target.checked)}/></label>
    <button className="mobile-reset" disabled={p.busy || !p.assigned} onClick={p.onReset}><RotateCcw size={18}/> Reset {p.secondTeamEnabled ? 'both teams' : 'team'}</button>
   </section>
   {p.notice && <div className="mobile-notice" role="status"><span>{p.notice}</span><button aria-label="Dismiss message" onClick={p.onDismiss}><X size={18}/></button></div>}
   <footer className="mobile-footer"><a href="mailto:plrushe@outlook.com">plrushe@outlook.com</a><a href="/privacy.html">Privacy & cookies</a>{p.privacyControls}</footer>
  </main>
  <div className="mobile-dock">{tab === 'game' && <div className="mobile-spin-actions"><button className="mobile-spin-primary" disabled={p.disabled} onClick={() => startSpin()}><Crosshair size={23}/>{p.busy ? 'Spinning…' : 'Spin Position'}</button><button disabled={p.busy || !p.players.some(player => !player.locked)} onClick={() => startSpin(true)}>Spin All</button></div>}<nav aria-label="Mobile navigation">{([{id:'game',label:'Game',icon:Home},{id:'squad',label:'Squad',icon:Users},{id:'settings',label:'Settings',icon:Settings}] as const).map(item => <button key={item.id} aria-current={tab === item.id ? 'page' : undefined} onClick={() => {setTab(item.id);window.scrollTo({top:0,behavior:'instant'});}}><item.icon size={23}/><span>{item.label}</span></button>)}</nav></div>
  <span className="sr-only" aria-live="polite">{p.result ? `${p.result.name} assigned to ${p.teamName(p.result.team)} at ${p.result.position}.` : ''}</span>
  {wheelOpen && <RouletteOverlay onClose={() => setWheelOpen(false)}><PositionWheel slots={p.wheelSlots} rotation={p.rotation} spinning={p.busy && !p.formationDisplay} instant={p.instant || reducedMotion}/><div className="mobile-wheel-result" aria-live="polite">{p.busy ? <><strong>Spinning…</strong><span>Your next position is on its way.</span></> : p.result ? <><strong>{p.result.position}</strong><span>{p.result.name} · {p.teamName(p.result.team)}</span></> : <strong>No eligible positions available</strong>}</div><button className="primary-button full" onClick={() => {setWheelOpen(false);setTab('game');window.scrollTo({top:0,behavior:'instant'});}}>Back to pitch</button>{p.busy && <p className="mobile-storage-note">You can close this view. The draw will continue.</p>}</RouletteOverlay>}
 </div>;
}
