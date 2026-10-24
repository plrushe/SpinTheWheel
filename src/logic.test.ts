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

describe('Single-team mode', () => {
 const teams = { A: formations[31].slots, B: formations[47].slots };
 it('draws only Team A for every formation and never spills into Team B', () => {
  for (const formation of formations) {
   const boards = { ...teams, A: formation.slots };
   let players = team(22);
   for (const player of shuffled(players)) {
    const plan = planAssignment(boards, players, player.id, false, ['A']);
    if (plan) players = players.map(p => p.id === player.id ? { ...p, teamId: plan.team, slotId: plan.slot.id } : p);
   }
   expect(players.filter(p => p.teamId === 'A')).toHaveLength(11);
   expect(players.some(p => p.teamId === 'B')).toBe(false);
   expect(new Set(players.filter(p => p.slotId).map(p => p.slotId)).size).toBe(11);
   expect(planAssignment(boards, players, 'extra', false, ['A'])).toBeUndefined();
  }
 });
 it('supports one player and rerolls their own released slot', () => {
  const plan = planAssignment(teams, team(1), '0', false, ['A'])!;
  expect(plan.team).toBe('A');
  const full = teams.A.map((slot,i) => ({ id:String(i),name:String(i),teamId:'A' as const,slotId:slot.id,locked:false }));
  expect(planAssignment(teams,full,'0',false,['A'])?.slot.id).toBe(full[0].slotId);
 });
 it('limits single-team GK-excluded draws to ten players', () => {
  let players = team(11);
  for (const player of players) {
   const plan = planAssignment(teams,players,player.id,true,['A']);
   if (plan) players = players.map(p => p.id === player.id ? { ...p,teamId:plan.team,slotId:plan.slot.id } : p);
  }
  expect(players.filter(p=>p.slotId)).toHaveLength(10);
  expect(players.some(p=>p.slotId==='GK'||p.teamId==='B')).toBe(false);
 });
 it('clears Team B locks and positions without losing names or Team A locks', () => {
  const players:Player[]=[{id:'a',name:'Paul',teamId:'A',slotId:'ST',locked:true},{id:'b',name:'Sam',teamId:'B',slotId:'ST',locked:true}];
  const changed=resetTeamAssignments(players,'B');
  expect(changed[0]).toEqual(players[0]);
  expect(changed[1]).toEqual({id:'b',name:'Sam',locked:false,teamId:undefined,slotId:undefined});
  expect(players[1].teamId).toBe('B');
 });
 it('can enable both teams again without changing Team A', () => {
  const players=teams.A.map((slot,i)=>({id:String(i),name:String(i),teamId:'A' as const,slotId:slot.id,locked:true}));
  expect(planAssignment(teams,players,'new',false,['A'])).toBeUndefined();
  expect(planAssignment(teams,players,'new',false,['A','B'])?.team).toBe('B');
 });
 it('returns no assignment when no teams are enabled',()=>expect(planAssignment(teams,team(1),'0',false,[])).toBeUndefined());
});
