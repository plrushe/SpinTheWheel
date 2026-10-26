import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { clearSavedGameData, readConsent, saveConsent, type StorageConsent } from './privacyStorage';

type Props = { settingsRequest: number; onConsentChange: (consent: StorageConsent) => void };
export function PrivacyControls({onConsentChange,settingsRequest}:Props) {
 const [consent,setConsent]=useState(readConsent);
 const [open,setOpen]=useState(false),[preferences,setPreferences]=useState(consent?.preferences ?? false),[message,setMessage]=useState('');
 useEffect(()=>{if(settingsRequest>0){setPreferences(consent?.preferences??false);setOpen(true);}},[settingsRequest]);
 useEffect(()=>{if(window.location.hash==='#cookie-settings')setOpen(true);},[]);
 const dialogRef=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  if(!open)return;
  const dialog=dialogRef.current!,opener=document.activeElement as HTMLElement|null;
  dialog.showModal();
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{dialog.close();document.body.style.overflow=previous;opener?.focus();};
 },[open]);
 function choose(allowed:boolean){
  const result=saveConsent(allowed);setConsent(result.consent);setOpen(false);onConsentChange(result.consent);
  setMessage(result.persisted?'Your privacy choice has been saved.':'Your choice applies to this visit, but browser storage is unavailable.');
 }
 return <>
  <button className="footer-link" onClick={()=>{setPreferences(consent?.preferences??false);setOpen(true);}}>Cookie settings</button>
  {!consent&&<section className="cookie-notice" aria-label="Cookies and local storage"><div><h2><ShieldCheck size={18}/> Your privacy, your choice</h2><p>We use local storage to remember this privacy choice. With your permission, we can also save your roster, team names and settings on this device. This choice only controls saved game preferences. Google advertising loads only after separate advertising permission from a configured consent platform. No analytics tracking is installed. <a href="/privacy.html">Privacy & cookies</a>.</p></div><div className="cookie-actions"><button className="secondary-button" onClick={()=>choose(false)}>Reject optional storage</button><button className="secondary-button" onClick={()=>choose(true)}>Accept optional storage</button><button className="cookie-manage" onClick={()=>{setPreferences(false);setOpen(true);}}>Manage preferences</button></div></section>}
  <span className="sr-only" role="status">{message}</span>
  {open&&<dialog ref={dialogRef} className="privacy-dialog" aria-labelledby="privacy-settings-title" onCancel={()=>setOpen(false)}><button className="privacy-close" aria-label="Close cookie settings" onClick={()=>setOpen(false)}><X size={20}/></button><span className="eyebrow">PRIVACY CONTROLS</span><h2 id="privacy-settings-title">Cookie & storage preferences</h2><p>You can play without accepting optional storage. These settings control game preferences, not Google advertising consent. Advertising choices must be managed through the site’s certified consent platform.</p><div className="privacy-setting"><div><strong>Privacy choice</strong><p>Essential storage remembers your choice for up to 180 days. Always active.</p></div><span>Required</span></div><label className="privacy-setting"><div><strong>Remember my roster and settings</strong><p>Save player names, team names and the team-draw preference on this device. Off unless you agree.</p></div><input type="checkbox" checked={preferences} onChange={e=>setPreferences(e.target.checked)}/></label><p>Changing your choice to reject removes previously saved roster and settings data. Your current in-memory lineup remains until you leave this page.</p><div className="privacy-dialog-actions"><button className="secondary-button" onClick={()=>choose(false)}>Reject optional storage</button><button className="secondary-button" onClick={()=>choose(preferences)}>Save preferences</button></div><button className="clear-data-button" onClick={()=>setMessage(clearSavedGameData()?'Saved roster, team names and settings cleared. Your current lineup is unchanged.':'Browser settings prevented clearing saved data. Please clear site data in your browser.')}>Clear saved roster & settings</button><p className="privacy-feedback" role="status">{message}</p><a className="privacy-policy-link" href="/privacy.html">Read the privacy & cookies policy</a></dialog>}
 </>;
}
