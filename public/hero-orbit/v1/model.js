import * as THREE from './vendor/three.module.min.js';
import {createVial,createFinishTextures} from './vial.js?v=14';
import {createGlassSculpture} from './glass.js?v=14';

const TAU=Math.PI*2;
export const VIAL_MOTION=Object.freeze([
  {period:12,phase:.10,floatPeriod:8.4,floatPhase:0,floatAmplitude:.075},
  {period:14,phase:0,floatPeriod:10.3,floatPhase:TAU/3,floatAmplitude:.060},
  {period:16,phase:-.10,floatPeriod:12.1,floatPhase:TAU*2/3,floatAmplitude:.085}
]);

export function makeEnvironment(){
  const e=new THREE.Scene();
  e.background=new THREE.Color(0,0,0);
  const spectrum=['#010103','#10144d','#1855ff','#04d9ff','#c4faff','#ffffff','#ffde9c','#ff9908','#e43b8b','#3e32ce','#020104'];
  const white=['#000000','#203461','#bcefff','#ffffff','#ffffff','#ffffff','#fae8bb','#e29d45','#000000'];
  function panel(p,size,power,angle,palette){
    const g=new THREE.PlaneGeometry(...size,96,1),uv=g.attributes.uv,colors=[];
    const stops=palette.map(c=>new THREE.Color(c));
    for(let i=0;i<uv.count;i++){
      const at=uv.getX(i)*(stops.length-1),a=Math.min(stops.length-2,Math.floor(at));
      const c=stops[a].clone().lerp(stops[a+1],at-a).multiplyScalar(power);
      colors.push(c.r,c.g,c.b);
    }
    g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    const mesh=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,toneMapped:false}));
    mesh.position.set(...p);mesh.lookAt(0,0,0);mesh.rotateZ(angle);e.add(mesh);
  }
  // Sparse white cards and narrow spectral sources surround an otherwise black
  // studio. Surface color and ambient haze do not reveal the glass.
  panel([-4.5,3.5,5.6],[1.8,6.5],17.0,-.22,white);
  panel([4.8,-1.8,4.4],[.65,5.2],16.0,.30,white);
  panel([.4,6.4,.3],[6.2,.22],14.0,.15,white);
  panel([-3.0,1.0,-5.8],[1.2,5.8],12.0,-.40,white);
  panel([4.2,.5,-4.7],[.65,5.4],14.0,.32,spectrum);
  panel([-4.8,-1.6,3.0],[.40,6.4],10.0,-.32,spectrum);
  panel([1.8,-5.8,1.5],[4.8,.20],11.0,-.28,spectrum);
  return e;
}

export function createLightingRig(scene){
  const root=new THREE.Group();root.name='Shared moving rim-light rig';scene.add(root);
  function light(color,intensity,position){
    const l=new THREE.DirectionalLight(color,intensity);l.position.set(...position);root.add(l);return l;
  }
  const cyan=light('#58deff',4.6,[-5.5,2.8,-3.5]);
  const amber=light('#ffc575',3.8,[5.2,-.8,-2.8]);
  const edge=light('#edf8ff',5.2,[.4,5.4,-4.7]);
  const key=light('#e7edff',1.55,[-3.7,4.8,7]);
  key.castShadow=true;key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.5,far:24});
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias=.025;key.shadow.bias=-.00015;key.shadow.radius=3;
  const sweeps=Array.from({length:3},(_,i)=>{
    const spot=new THREE.SpotLight('#64deff',30,15,.31,.92,2);
    spot.name='Staggered product softbox '+(i+1);scene.add(spot,spot.target);return spot;
  });
  const pulse=(time,period,phase)=>Math.pow(.5+.5*Math.sin(time*TAU/period+phase),3);
  const palette=['#40dfff','#4d81ff','#f467d1','#ffc078','#67e9ec'].map(c=>new THREE.Color(c));
  const accent=new THREE.Color(),white=new THREE.Color('#ffffff');
  const target=new THREE.Vector3();
  function update(time,vials=[]){
    const phase=(time/1.35)%palette.length,index=Math.floor(phase),fraction=phase-index;
    accent.copy(palette[index]).lerp(palette[(index+1)%palette.length],fraction*fraction*(3-2*fraction));
    root.rotation.y=.36*Math.sin(time*.72);
    root.rotation.z=.16*Math.sin(time*.91);
    cyan.intensity=2.2+5.6*pulse(time,2.7,0);
    amber.intensity=1.8+5.2*pulse(time,3.3,2.3);
    edge.intensity=3.2+5.3*pulse(time,2.2,4.6);
    cyan.color.copy(accent);
    amber.color.copy(accent).lerp(white,.16);
    edge.color.copy(accent).lerp(white,.62);
    key.color.copy(accent).lerp(white,.78);
    sweeps.forEach((spot,i)=>{
      vials[i]?.getWorldPosition(target);
      spot.target.position.copy(target);spot.target.position.y-=.3;
      spot.position.copy(target);
      spot.position.x+=[-2.2,.9,2.2][i]+.65*Math.sin(time*.94+i*2.1);
      spot.position.y+=2.6;spot.position.z+=4.4;
      spot.color.copy(accent);
      spot.intensity=14+72*pulse(time,[2.6,3.1,3.7][i],i*TAU/3);
    });
  }
  return{root,update};
}

export function createOrbitalModel({labelTextures=[],labelMetadata=[],foilTexture}={}){
  const root=new THREE.Group();root.name='Ruined RX rotating vial trio';
  const sculpture=createGlassSculpture();root.add(sculpture.root);
  const finishes=createFinishTextures();
  const bodies=[],vials=[];
  for(let i=0;i<3;i++){
    const body=createVial({labelTexture:labelTextures[i],label:labelMetadata[i],foilTexture,finishes}).group;
    const pivot=new THREE.Group();pivot.name=['Left vial','Center vial','Right vial'][i];
    body.name=labelMetadata[i]?.name||'Continuously rotating vial body';pivot.add(body);root.add(pivot);
    bodies.push(body);vials.push(pivot);
  }
  let portrait=false;
  function layout(aspect){portrait=aspect<.8;sculpture.layout(portrait);}
  function update(time){
    const gap=portrait?1.14:1.65,sideScale=portrait?.74:.86;
    vials[0].scale.setScalar(sideScale);vials[2].scale.setScalar(sideScale);vials[1].scale.setScalar(1.04);
    const anchors=[[-gap,portrait?.68:.35,-.65],[0,portrait?-.46:-.20,.70],[gap,portrait?.52:.08,-.82]];
    vials.forEach((pivot,i)=>{
      const s=VIAL_MOTION[i],a=anchors[i];
      pivot.position.set(a[0],a[1]+s.floatAmplitude*Math.sin(time*TAU/s.floatPeriod+s.floatPhase),a[2]);
      // The support holds a slight fixed tilt while the vial rotates about its
      // own long axis. There is no rocking reversal or fake image rotation.
      pivot.rotation.set(.025,0,(i-1)*-.08);
      bodies[i].rotation.y=s.phase+time*TAU/s.period;
    });
    sculpture.update(time,vials);
  }
  update(0);return{root,vials,vial:vials[1],bodies,sculpture,resources:Object.values(finishes),layout,update};
}
