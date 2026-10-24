import { useId, useState } from 'react';
import { LockKeyhole, UnlockKeyhole } from 'lucide-react';

export function FormationLockButton({ locked, disabled, onToggle }: { locked: boolean; disabled: boolean; onToggle: () => void }) {
 const tooltipId = useId();
 const [hovered, setHovered] = useState(false);
 const [focused, setFocused] = useState(false);
 const [dismissed, setDismissed] = useState(false);
 const visible = (hovered || focused) && !dismissed;
 const label = locked ? 'Unlock team formation' : 'Lock team formation';
 return <span className="formation-lock-control" onMouseEnter={() => { setHovered(true); setDismissed(false); }} onMouseLeave={() => setHovered(false)}>
  <button className={`icon-button ${locked ? 'active' : ''}`} aria-label={label} aria-pressed={locked} aria-describedby={visible ? tooltipId : undefined} disabled={disabled} onClick={onToggle} onFocus={() => { setFocused(true); setDismissed(false); }} onBlur={() => setFocused(false)} onKeyDown={e => { if (e.key === 'Escape') setDismissed(true); }}>
   {locked ? <LockKeyhole size={17}/> : <UnlockKeyhole size={17}/>}
  </button>
  {visible && <span id={tooltipId} className="formation-lock-tooltip" role="tooltip">{label}</span>}
 </span>;
}
