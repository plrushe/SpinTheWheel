import { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

export function ResetConfirmation({ onCancel, onConfirm, secondTeamEnabled = true }: { secondTeamEnabled?: boolean; onCancel: () => void; onConfirm: () => void }) {
 const ref = useRef<HTMLDialogElement>(null);
 const cancelRef = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  const dialog = ref.current!;
  const opener = document.activeElement as HTMLElement | null;
  dialog.showModal();
  cancelRef.current?.focus();
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
   dialog.close();
   document.body.style.overflow = overflow;
   if (opener?.matches(':disabled')) document.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus();
   else opener?.focus();
  };
 }, []);
 return <dialog ref={ref} className="reset-confirmation" aria-labelledby="reset-title" aria-describedby="reset-description" onCancel={onCancel}>
  <span className="reset-symbol"><RotateCcw size={23}/></span>
  <h2 id="reset-title">Are you sure?</h2>
  <p id="reset-description">This will clear {secondTeamEnabled?'both teams’':'your team’s'} positions and player locks. Your player names and chosen formations will stay saved.</p>
  <div className="reset-actions"><button ref={cancelRef} className="secondary-button" onClick={onCancel}>Cancel</button><button className="primary-button" onClick={onConfirm}>Yes, reset {secondTeamEnabled?'both teams':'team'}</button></div>
 </dialog>;
}
