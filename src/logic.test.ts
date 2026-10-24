import { describe, expect, it } from 'vitest';
import { formations } from './formations';
import { availableSlots, resetAssignments, shuffleTeam, randomIndex, planAssignment, resetTeamAssignments, shuffled, type Player } from './logic';
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

describe('Two-team assignment workflow', () => {
 const teams = { A: formations[31].slots, B: formations[47].slots };
 function assign(players: Player[], excludeGK = false) {
  let result = players.map(p => p.locked ? p : { ...p, slotId: undefined, teamId: undefined });
  for (const player of shuffled(result.filter(p => !p.locked))) {
   const plan = planAssignment(teams, result, player.id, excludeGK);
   if (plan) result = result.map(p => p.id === player.id ? { ...p, teamId: plan.team, slotId: plan.slot.id } : p);
  }
  return result;
 }
 for (const size of [1,2,5,11,21,22]) it(`assigns ${size} players to balanced teams without overlapping slots`, () => {
  for (let run=0;run<20;run++) {
   const players = assign(team(size));
   expect(players.every(p => p.teamId && teams[p.teamId].some(s => s.id === p.slotId))).toBe(true);
   expect(new Set(players.map(p => `${p.teamId}:${p.slotId}`)).size).toBe(size);
   expect(Math.abs(players.filter(p=>p.teamId==='A').length-players.filter(p=>p.teamId==='B').length)).toBeLessThanOrEqual(1);
  }
 });
 it('allows the same position on opposite teams', () => {
  const players=assign(team(22));
  expect(players.filter(p=>p.slotId==='GK')).toHaveLength(2);
 });
 it('preserves the team and position of locked players', () => {
  const players=team(22);players[0]={...players[0],locked:true,teamId:'B',slotId:'ST'};
  const result=assign(players);
  expect(result[0]).toEqual(players[0]);
  expect(new Set(result.map(p=>`${p.teamId}:${p.slotId}`)).size).toBe(22);
 });
 it('releases the current player from a full team before rerolling', () => {
  const players=assign(team(22));const player=players[0];
  const plan=planAssignment(teams,players,player.id,false)!;
  expect(plan.team).toBe(player.teamId);expect(plan.slot.id).toBe(player.slotId);
 });
 it('chooses the team with space when the other is full', () => {
  const players=teams.A.map((slot,i)=>({id:String(i),name:String(i),teamId:'A' as const,slotId:slot.id,locked:true}));
  expect(planAssignment(teams,players,'new',false)?.team).toBe('B');
 });
 it('excludes both goalkeepers and safely leaves two unassigned at capacity', () => {
  const result=assign(team(22),true);
  expect(result.filter(p=>p.slotId)).toHaveLength(20);
  expect(result.some(p=>p.slotId==='GK')).toBe(false);
  expect(planAssignment(teams,result,'extra',true)).toBeUndefined();
 });
 it('clears only the changed team and preserves the other team’s locks', () => {
  const players:Player[]=[{id:'a',name:'A',teamId:'A',slotId:'ST',locked:true},{id:'b',name:'B',teamId:'B',slotId:'ST',locked:true}];
  const result=resetTeamAssignments(players,'A');
  expect(result[0].teamId).toBeUndefined();expect(result[0].slotId).toBeUndefined();expect(result[0].locked).toBe(false);
  expect(result[1]).toEqual(players[1]);
  expect(resetAssignments(players).every(p=>!p.teamId&&!p.slotId&&!p.locked)).toBe(true);
 });
});
