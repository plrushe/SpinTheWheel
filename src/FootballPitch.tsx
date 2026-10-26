import { forwardRef, useId } from 'react';
import type { Formation } from './formations';
import type { Player } from './logic';
import { getPlayerSetPieces, setPieceRoles, type SetPieceAssignments } from './setPieces';

type Props = { mobile?: boolean; formation: Formation; players: Player[]; latest?: string; teamName?: string; accent?: string; setPieces?: SetPieceAssignments };
// Project the same percentage-based tactical coordinates onto a stadium pitch.
const stadiumProject = (x: number, y: number) => ({ x: 300 + (x - 50) * (4.12 + y * .017), y: 20 + y * 4.58 });
export const FootballPitch = forwardRef<SVGSVGElement, Props>(({ formation, players, latest, teamName='', accent='#c3f56c', setPieces={}, mobile=false }, ref) => {
 const project = mobile ? (x:number,y:number)=>({x:18+x*5.64,y:18+y*6.64}) : stadiumProject;
 const point = (x:number,y:number)=>{const p=project(x,y);return `${p.x},${p.y}`;};
 const area = (left:number,top:number,right:number,bottom:number)=>`${point(left,top)} ${point(right,top)} ${point(right,bottom)} ${point(left,bottom)}`;
 const circle = (x:number,y:number,rx:number,ry:number)=>Array.from({length:65},(_,i)=>point(x+rx*Math.cos(i*Math.PI/32),y+ry*Math.sin(i*Math.PI/32))).join(' ');
 const uid=useId().replace(/:/g,'');
 const assignedRoles=setPieceRoles.filter(role=>players.some(p=>p.slotId&&p.id===setPieces[role.id]));
 const dutySummary=players.map(player=>{const roles=getPlayerSetPieces(setPieces,player);return roles.length?`${player.name}: ${roles.map(role=>role.label).join(', ')}`:'';}).filter(Boolean).join('; ');

 return <svg ref={ref} className={`pitch${mobile?' mobile-pitch':''}`} viewBox={`0 0 600 ${mobile?(assignedRoles.length?748:700):(assignedRoles.length?548:500)}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${teamName} ${formation.name} formation with ${players.filter(p=>p.slotId).length} assigned players${dutySummary?`. Set-piece takers: ${dutySummary}`:''}`}>
  <defs>
   <linearGradient id={`${uid}-night`} x2="0" y2="1"><stop stopColor="#111c23"/><stop offset="1" stopColor="#07100e"/></linearGradient>
   <radialGradient id={`${uid}-light`}><stop stopColor="#f4f7ff" stopOpacity=".85"/><stop offset=".15" stopColor="#b8d4f6" stopOpacity=".24"/><stop offset="1" stopColor="#9ec4ff" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${uid}-grass-light`}><stop stopColor="#8cc83a" stopOpacity=".12"/><stop offset="1" stopColor="#122c08" stopOpacity=".24"/></radialGradient>
   <pattern id={`${uid}-crowd`} width="9" height="7" patternUnits="userSpaceOnUse"><rect width="9" height="7" fill="#15262c"/><circle cx="2" cy="2" r=".8" fill="#71929f" opacity=".4"/><circle cx="6" cy="5" r=".7" fill="#c8d6bf" opacity=".25"/></pattern>
   <pattern id={`${uid}-net`} width="5" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H5V4" stroke="#d3dfc4" strokeWidth=".6" fill="none"/></pattern>
   <filter id={`${uid}-texture`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="21" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
   <clipPath id={`${uid}-field`}><polygon points={area(0,0,100,100)}/></clipPath>
  </defs>
  {mobile?<g><rect width="600" height={assignedRoles.length?748:700} rx="20" fill="#3c5740"/>{Array.from({length:14},(_,i)=><rect key={i} x="18" y={18+i*47.43} width="564" height="47.43" fill={i%2?'#3a533e':'#405b43'}/>)}</g>:<g>
  <rect width="600" height={assignedRoles.length?548:500} rx="10" fill={`url(#${uid}-night)`}/>
  <path d="M0 55 85 97 55 340 0 393ZM600 55 515 97 545 340 600 393Z" fill={`url(#${uid}-crowd)`}/>
  <g stroke="#5e7b86" fill="none" opacity=".35" strokeWidth="2"><path d="M0 95 80 127M0 135 76 161M0 184 69 205M0 245 65 259M0 310 58 317M600 95 520 127M600 135 524 161M600 184 531 205M600 245 535 259M600 310 542 317"/></g>
  {[27,573].map(x=><g key={x}><ellipse cx={x} cy="52" rx="62" ry="90" fill={`url(#${uid}-light)`}/><rect x={x-7} y="33" width="14" height="33" rx="3" fill="#223543"/>{[0,1,2].flatMap(row=>[0,1].map(col=><circle key={`${row}-${col}`} cx={x-3+col*6} cy={39+row*9} r="2.4" fill="#f3f7ff"/>))}</g>)}
  <polygon points={area(0,0,100,100)} fill="#2c601f" stroke="#506f28" strokeWidth="2"/>
  {Array.from({length:10},(_,i)=><polygon key={i} points={area(0,i*10,100,(i+1)*10)} fill={i%2?'#316824':'#295b1e'}/>)}
  <polygon points={area(0,0,100,100)} fill={`url(#${uid}-grass-light)`}/>
  <g clipPath={`url(#${uid}-field)`}><rect width="600" height="500" filter={`url(#${uid}-texture)`} opacity=".15" style={{mixBlendMode:'soft-light'}}/></g>
  </g>}
  <g fill="none" stroke="#d5e3bc" strokeWidth="1.6" opacity=".72">
   <polygon points={area(4,3,96,97)}/><polyline points={`${point(4,50)} ${point(96,50)}`}/><polyline points={circle(50,50,15,12)}/>
   <polyline points={`${point(20,3)} ${point(20,20)} ${point(80,20)} ${point(80,3)}`}/><polyline points={`${point(35,3)} ${point(35,9)} ${point(65,9)} ${point(65,3)}`}/>
   <polyline points={`${point(20,97)} ${point(20,80)} ${point(80,80)} ${point(80,97)}`}/><polyline points={`${point(35,97)} ${point(35,91)} ${point(65,91)} ${point(65,97)}`}/>
   <path d={`M${point(37,20)}Q${point(50,30)} ${point(63,20)}M${point(37,80)}Q${point(50,70)} ${point(63,80)}`}/>
  </g>
  {[13,50,87].map(y=>{const p=project(50,y);return <circle key={y} cx={p.x} cy={p.y} r="1.6" fill="#d5e3bc" opacity=".8"/>;})}
  <g fill={`url(#${uid}-net)`} stroke="#c1d5ac" strokeWidth="1" opacity=".8"><polygon points={area(43,.2,57,3)}/><polygon points={area(43,97,57,102)}/></g>
  <g fontFamily="Arial, sans-serif" textAnchor="middle">{formation.slots.map(slot=>{
   const player=players.find(p=>p.slotId===slot.id), pos=project(slot.x,slot.y);
   const duties=getPlayerSetPieces(setPieces,player);
   const dutyCodes=duties.length>3?`${duties.slice(0,2).map(role=>role.shortLabel).join(' · ')} +${duties.length-2}`:duties.map(role=>role.shortLabel).join(' · ');
   const badgeWidth=Math.max(24,dutyCodes.length*5.6+12);
   const neighbours=formation.slots.filter(s=>s.id!==slot.id&&Math.abs(s.y-slot.y)<12);
   const labelWidth=Math.min(mobile?105:88,...neighbours.map(s=>Math.abs(project(s.x,s.y).x-pos.x)-5)), maxChars=Math.floor(labelWidth/6.9);
   return <g key={slot.id} className={`pitch-marker ${latest===slot.id?'latest':''}`} style={{transform:`translate(${pos.x}px, ${pos.y}px)`}}>
    <circle r={mobile?27:21} fill={player?accent:'#f6f8f2'} stroke={player?accent:'#e2e7d9'} strokeWidth="1.5"/>
    <text y={duties.length?-3:4} fill="#17281a" fontWeight="800" fontSize={mobile?16:13}>{slot.label}</text>
    {duties.length>0&&<g className="set-piece-badge" role="img" tabIndex={0} aria-label={`${player!.name}: ${duties.map(role=>role.label).join(', ')}`} data-duties={duties.map(role=>role.id).join(' ')}><title>{`${player!.name}: ${duties.map(role=>role.label).join(', ')}`}</title><rect x={-badgeWidth/2} y="9" width={badgeWidth} height="14" rx="4" fill="#172a0d" stroke="#d0f58a" strokeWidth="1"/><text y="19" fontSize="9" fontWeight="700" fill="#dcffa2">{dutyCodes}</text></g>}
    {player?<g className="player-label"><title>{player.name}</title><rect x={-labelWidth/2} y="24" width={labelWidth} height="20" rx="4" fill="#10250e" fillOpacity=".9"/><text y="38" fill="#f3f9e9" fontSize="12.5" fontWeight="600">{player.name.length>maxChars?player.name.slice(0,maxChars-1)+'…':player.name}</text></g>:!mobile&&<text className="pitch-available-label" y="36" fill="#dae5ce" fontSize="9" letterSpacing="1">AVAILABLE</text>}
   </g>;
  })}</g>
  {assignedRoles.length>0&&<g className="set-piece-legend" fontFamily="Arial, sans-serif"><path d={mobile?"M18 702H582":"M18 502H582"} stroke="#3b5133" strokeWidth="1"/>{assignedRoles.map((role,i)=><text key={role.id} x={20+(i%3)*193} y={(mobile?720:520)+Math.floor(i/3)*18} fontSize="10"><tspan fontWeight="700" fill="#d4f89a">{role.shortLabel}</tspan><tspan dx="6" fill="#c0d0b6">{role.label}</tspan></text>)}</g>}
 </svg>;
});
