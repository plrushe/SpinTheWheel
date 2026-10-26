export const CONSENT_KEY = 'football-roulette-consent-v1';
export const GAME_STORAGE_KEYS = ['fc-roulette-roster-v1', 'fc-roulette-team-names-v1', 'fc-roulette-second-team-enabled-v1'] as const;
const CONSENT_LIFETIME = 180 * 24 * 60 * 60 * 1000;
export type StorageConsent = { version: 1; preferences: boolean; savedAt: number };
export function parseConsent(raw: string | null, now = Date.now()): StorageConsent | null {
 try {
  const value = JSON.parse(raw || 'null');
  return value?.version === 1 && typeof value.preferences === 'boolean' && Number.isFinite(value.savedAt) && value.savedAt <= now && now - value.savedAt < CONSENT_LIFETIME ? value : null;
 } catch { return null; }
}
export function readConsent(): StorageConsent | null {
 try { return parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}
export function canRemember(): boolean { return readConsent()?.preferences === true; }
export function readPreference(key: string): string | null {
 if (!canRemember()) return null;
 try { return localStorage.getItem(key); } catch { return null; }
}
export function writePreference(key: string, value: string): boolean {
 if (!canRemember()) return false;
 try { localStorage.setItem(key,value); return true; } catch { return false; }
}
export function clearSavedGameData(): boolean {
 try { for (const key of GAME_STORAGE_KEYS) localStorage.removeItem(key); return true; } catch { return false; }
}
export function saveConsent(preferences: boolean): { consent: StorageConsent; persisted: boolean } {
 const consent: StorageConsent = { version: 1, preferences, savedAt: Date.now() };
 if (!preferences) clearSavedGameData();
 try { localStorage.setItem(CONSENT_KEY,JSON.stringify(consent)); return {consent,persisted:true}; }
 catch { return {consent,persisted:false}; }
}
