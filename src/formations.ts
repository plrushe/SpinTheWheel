export type Slot = { id: string; label: string; x: number; y: number };
export type Formation = { id: string; name: string; backs: number; slots: Slot[] };
// Rows are ordered from defence to attack; keeper is always at the bottom.
const back4 = 'LB LCB RCB RB';
const back3 = 'LCB CB RCB';
const back5 = 'LWB LCB CB RCB RWB';
const definitions: [string, string[]][] = [
 ['3-1-4-2',[back3,'CDM','LM LCM RCM RM','LST RST']],
 ['3-4-1-2',[back3,'LM LCM RCM RM','CAM','LST RST']],
 ['3-4-2-1',[back3,'LM LCM RCM RM','LF RF','ST']],
 ['3-4-3',[back3,'LM LCM RCM RM','LW ST RW']],
 ['3-4-3 Diamond',[back3,'CDM','LM RM','CAM','LW ST RW']],
 ['3-4-3 Flat',[back3,'LM LCM RCM RM','LW ST RW']],
 ['3-5-1-1',[back3,'LM LCM CDM RCM RM','CF','ST']],
 ['3-5-2',[back3,'LM LCDM RCDM RM','CAM','LST RST']],
 ['4-1-2-1-2',[back4,'CDM','LM RM','CAM','LST RST']],
 ['4-1-2-1-2 (2)',[back4,'CDM','LCM RCM','CAM','LST RST']],
 ['4-1-2-1-2 Narrow',[back4,'CDM','LCM RCM','CAM','LST RST']],
 ['4-1-2-1-2 Wide',[back4,'CDM','LM RM','CAM','LST RST']],
 ['4-1-3-2',[back4,'CDM','LM CM RM','LST RST']],
 ['4-1-4-1',[back4,'CDM','LM LCM RCM RM','ST']],
 ['4-2-2-2',[back4,'LCDM RCDM','LCAM RCAM','LST RST']],
 ['4-2-3-1',[back4,'LCDM RCDM','LM CAM RM','ST']],
 ['4-2-3-1 (2)',[back4,'LCDM RCDM','LM CAM RM','ST']],
 ['4-2-3-1 Narrow',[back4,'LCDM RCDM','LCAM CAM RCAM','ST']],
 ['4-2-3-1 Wide',[back4,'LCDM RCDM','LM CAM RM','ST']],
 ['4-2-4',[back4,'LCM RCM','LW LST RST RW']],
 ['4-3-1-2',[back4,'LCM CM RCM','CAM','LST RST']],
 ['4-3-2-1',[back4,'LCM CM RCM','LF RF','ST']],
 ['4-3-3',[back4,'LCM CM RCM','LW ST RW']],
 ['4-3-3 (2)',[back4,'CDM','LCM RCM','LW ST RW']],
 ['4-3-3 (3)',[back4,'LCDM RCDM','CM','LW ST RW']],
 ['4-3-3 (4)',[back4,'LCM RCM','CAM','LW ST RW']],
 ['4-3-3 (5)',[back4,'CDM','LCM RCM','LW CF RW']],
 ['4-3-3 Attack',[back4,'LCM RCM','CAM','LW ST RW']],
 ['4-3-3 Defend',[back4,'LCDM RCDM','CM','LW ST RW']],
 ['4-3-3 False 9',[back4,'CDM','LCM RCM','LW CF RW']],
 ['4-3-3 Flat',[back4,'LCM CM RCM','LW ST RW']],
 ['4-3-3 Holding',[back4,'CDM','LCM RCM','LW ST RW']],
 ['4-4-1-1',[back4,'LM LCM RCM RM','CF','ST']],
 ['4-4-1-1 (2)',[back4,'LM LCM RCM RM','CAM','ST']],
 ['4-4-1-1 Attack',[back4,'LM LCM RCM RM','CF','ST']],
 ['4-4-1-1 Midfield',[back4,'LM LCM RCM RM','CAM','ST']],
 ['4-4-2',[back4,'LM LCM RCM RM','LST RST']],
 ['4-4-2 (2)',[back4,'LM LCDM RCDM RM','LST RST']],
 ['4-4-2 Flat',[back4,'LM LCM RCM RM','LST RST']],
 ['4-4-2 Holding',[back4,'LM LCDM RCDM RM','LST RST']],
 ['4-5-1',[back4,'LM CM RM','LCAM RCAM','ST']],
 ['4-5-1 (2)',[back4,'LM LCM CM RCM RM','ST']],
 ['4-5-1 Attack',[back4,'LM CM RM','LCAM RCAM','ST']],
 ['4-5-1 Flat',[back4,'LM LCM CM RCM RM','ST']],
 ['5-2-1-2',[back5,'LCM RCM','CAM','LST RST']],
 ['5-2-2-1',[back5,'LCM RCM','LF RF','ST']],
 ['5-2-3',[back5,'LCM RCM','LW ST RW']],
 ['5-3-2',[back5,'LCM CM RCM','LST RST']],
 ['5-4-1',[back5,'LM LCM RCM RM','ST']],
 ['5-4-1 Diamond',[back5,'CDM','LM RM','CAM','ST']],
 ['5-4-1 Flat',[back5,'LM LCM RCM RM','ST']],
];
export const formations: Formation[] = definitions.map(([name, rows], i) => ({
 id: `formation-${i}`, name, backs: Number(name[0]),
 slots: [{ id: 'GK', label: 'GK', x: 50, y: 91 }, ...rows.flatMap((row, index) => {
   const labels = row.split(' ');
   const y = rows.length === 2 ? [72, 24][index] : 76 - index * (58 / (rows.length - 1));
   return labels.map((label, j) => {
     let x = labels.length === 1 ? 50 : 16 + j * 68 / (labels.length - 1);
     if (labels.length === 2) x = ['LM','LW','LWB'].includes(labels[0]) ? (j ? 84 : 16) : (j ? 65 : 35);
     if (labels.length === 3 && labels[0] === 'LCB') x = [28,50,72][j];
     // False-nine drops between the two wide attackers.
     let adjustedY = y;
     if (label === 'CF' && row.includes('LW')) adjustedY += 8;
     if (label.endsWith('WB')) adjustedY -= 8;
     if (['LM','RM'].includes(label) && row.includes('CDM')) adjustedY -= 8;
     if (label === 'CDM' && row.includes('LCM')) adjustedY += 8;
     return { id: label, label, x, y: adjustedY };
   });
 })]
}));
