import { describe, expect, it } from 'vitest';
import { drawSetPieces, reconcileSetPieces, setPieceRoles, getPlayerSetPieces } from './setPieces';
import { displayTeamName } from './teamNames';
import type { Player } from './logic';
const players: Player[] = [
 {id:'a',name:'Paul',teamId:'A',slotId:'ST',locked:true},
 {id:'b',name:'Sam',teamId:'B',slotId:'ST',locked:false},
 {id:'c',name:'Alex',locked:false},
];
describe('Set-piece takers', () => {
 it('draws every requested duty from only the selected team’s assigned players', () => {
  const roles=setPieceRoles.map(r=>r.id);
  for(const team of ['A','B'] as const) {
   const result=drawSetPieces(players,team,roles);
   expect(Object.keys(result)).toHaveLength(6);
   expect(Object.values(result).every(id=>id===(team==='A'?'a':'b'))).toBe(true);
  }
 });
 it('supports one teammate taking multiple duties, including locked players', () => {
  expect(drawSetPieces(players,'A',['penalties','free-kicks'])).toEqual({'penalties':'a','free-kicks':'a'});
 });
 it('handles empty teams and disabled duties', () => {
  expect(drawSetPieces([],'A',['penalties'])).toEqual({});
  expect(drawSetPieces(players,'A',[])).toEqual({});
 });
 it('invalidates duties when a player leaves a team or is reset', () => {
  const result={'penalties':'a','free-kicks':'b'};
  expect(reconcileSetPieces(result,players,'A')).toEqual({'penalties':'a'});
  expect(reconcileSetPieces(result,players.map(p=>({...p,slotId:undefined})),'A')).toEqual({});
 });
 it('keeps valid duties across player renames and position rerolls', () => {
  expect(reconcileSetPieces({'penalties':'a'},[{...players[0],name:'New name',slotId:'CM'}],'A')).toEqual({'penalties':'a'});
 });
});
describe('Team names', () => {
 it('uses trimmed custom names and falls back for blank names', () => {
  expect(displayTeamName({A:'  Lions  ',B:'   '},'A')).toBe('Lions');
  expect(displayTeamName({A:'Lions',B:'   '},'B')).toBe('Team B');
 });
});

describe('Pitch set-piece indicators', () => {
 it('lists every duty for the assigned player in a stable order', () => {
  const result=drawSetPieces(players,'A',setPieceRoles.map(role=>role.id));
  expect(getPlayerSetPieces(result,players[0]).map(role=>role.id)).toEqual(setPieceRoles.map(role=>role.id));
  expect(new Set(getPlayerSetPieces(result,players[0]).map(role=>role.shortLabel)).size).toBe(6);
 });
 it('never labels unassigned players or empty positions', () => {
  expect(getPlayerSetPieces({'penalties':'c'},players[2])).toEqual([]);
  expect(getPlayerSetPieces({'penalties':'a'},undefined)).toEqual([]);
 });
 it('shows only duties belonging to that player', () => {
  expect(getPlayerSetPieces({'free-kicks':'a','penalties':'b'},players[0]).map(role=>role.label)).toEqual(['Free kicks']);
 });
 it('drops a badge when the duty is removed', () => {
  const assignments={'free-kicks':'a','penalties':'a'};
  expect(getPlayerSetPieces(assignments,players[0])).toHaveLength(2);
  const {penalties:removed,...remaining}=assignments;
  expect(getPlayerSetPieces(remaining,players[0]).map(role=>role.shortLabel)).toEqual(['FK']);
 });
});
