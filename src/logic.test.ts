import { describe, expect, it } from 'vitest';
import { formations } from './formations';
import { availableSlots, resetAssignments, shuffleTeam, randomIndex, type Player } from './logic';
const slots=formations[31].slots;
const team=(n:number):Player[]=>Array.from({length:n},(_,i)=>({id:String(i),name:`Player ${i}`,locked:false}));
describe('Formation catalogue',()=>{
 it('contains all 51 unique named variants',()=>{expect(formations).toHaveLength(51);expect(new Set(formations.map(f=>f.name)).size).toBe(51);});
 for(const f of formations)it(`${f.name} has 11 distinct, spaced slots including GK`,()=>{expect(f.slots).toHaveLength(11);expect(new Set(f.slots.map(s=>s.id)).size).toBe(11);expect(f.slots.filter(s=>s.label==='GK')).toHaveLength(1);for(const s of f.slots){expect(s.x).toBeGreaterThan(0);expect(s.x).toBeLessThan(100);expect(s.y).toBeGreaterThan(0);expect(s.y).toBeLessThan(100);}expect(new Set(f.slots.map(s=>`${s.x}/${s.y}`)).size).toBe(11);});
 it('matches the requested 4-3-3 Holding positions',()=>{expect(slots.map(s=>s.id)).toEqual(['GK','LB','LCB','RCB','RB','CDM','LCM','RCM','LW','ST','RW']);});
});
describe('Assignment rules',()=>{
 it('supports a single player',()=>{const result=shuffleTeam(team(1),slots,false);expect(slots.some(s=>s.id===result[0].slotId)).toBe(true);});
 it('never overlaps slots for complete teams in any formation',()=>{for(const f of formations)for(let n=0;n<20;n++){const result=shuffleTeam(team(11),f.slots,false);expect(new Set(result.map(p=>p.slotId)).size).toBe(11);expect(result.every(p=>f.slots.some(s=>s.id===p.slotId))).toBe(true);}});
 it('keeps locked players fixed while shuffling everyone else',()=>{const players=team(11);players[0]={...players[0],slotId:'ST',locked:true};const result=shuffleTeam(players,slots,false);expect(result[0]).toEqual(players[0]);expect(new Set(result.map(p=>p.slotId)).size).toBe(11);});
 it('releases a player’s previous slot and excludes occupied slots',()=>{const players=team(2).map((p,i)=>({...p,slotId:i?'LCM':'ST'}));const pool=availableSlots(slots,players,'0',false);expect(pool.some(s=>s.id==='ST')).toBe(true);expect(pool.some(s=>s.id==='LCM')).toBe(false);});
 it('excludes goalkeeper and leaves at most one unassigned in an 11-player team',()=>{const result=shuffleTeam(team(11),slots,true);expect(result.some(p=>p.slotId==='GK')).toBe(false);expect(result.filter(p=>!p.slotId)).toHaveLength(1);});
 it('clears positions and locks on formation change',()=>{const players=[{id:'a',name:'Paul',slotId:'ST',locked:true}];expect(resetAssignments(players)).toEqual([{id:'a',name:'Paul',slotId:undefined,locked:false}]);expect(players[0].slotId).toBe('ST');});
 it('rejects empty random pools',()=>expect(()=>randomIndex(0)).toThrow());
});
